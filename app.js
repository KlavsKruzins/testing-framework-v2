const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const {upload_file} = require('./public/js/upload-file');
const {createIntentList} = require('./read_write_functions/getIntentList');
const {LexTester} = require('./lib/processTests');
const app = express();
const {writeTestCase} = require('./read_write_functions/write-test-template.js');
const {readDirectoryPromise} = require('./read_write_functions/read-past-tests.js.js');
const fs = require('fs')
const {convert} = require('./read_write_functions/write-results.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post('/uploadfile', async (req,res) => {
    
    upload_file(req,res,app);
    res.statusMessage = "File uploaded";
    res.statusCode = 200;
    res.render('enter_credentials');
});

app.post('/enter_credentials', async (req,res)=>{
    const {access_token,access_key,key_id,bot_alias} = req.body;
    process.env['ACCESS_TOKEN'] = access_token;
    process.env['ACCESS_KEY'] = access_key;
    process.env['KEY_ID'] = key_id;
    process.env['BOT_ALIAS'] = bot_alias;
    const filePath = app.get('filePath');
    console.log(filePath)
    const botFile = require(`.${filePath}`);
    app.set('botFile',`.${filePath}`);
    app.set('botName',botFile.resource.name);
    readDirectoryPromise()
    .then(data => {res.render('set_test_phrase_amount',{testArchive: data})})
    .catch(err => {console.log(err)});
    ;
});
app.post('/populate_from_archive',(req,res)=>{
    const pastTest = req.body;
    var data = JSON.parse(fs.readFileSync(`./test_cases/${pastTest.chosenTest}`));
    res.render('prepopulated-template',{pastTest:data})
})


app.post('/create_template',(req,res)=>{
    const {testphrases} = req.body;
    app.set('testphraseCount',testphrases);
    const botFile = require(app.get('botFile'));
    const intentList = createIntentList(botFile);
    res.render('testtemplate',{testphrases:testphrases,intentList:intentList});
});

app.post('/run_tests',(req,res)=>{
    const lexTester = new LexTester(process.env['ACCESS_TOKEN'],process.env['ACCESS_KEY'],process.env['KEY_ID']);
    const intentTestphrasePairs = convertObjectValuesToArray(req.body);
    const saveTests = intentTestphrasePairs['save-test'] == 'on'? true : false;
    delete intentTestphrasePairs['save-test'];
    if(saveTests){
        writeTestCase(intentTestphrasePairs);
    }
    const testObjectArray = []
    Object.keys(intentTestphrasePairs).forEach(intentName => {
        
            intentTestphrasePairs[intentName].forEach(testphrase => {
                testObjectArray.push({"Question":testphrase,"ExpectedIntent":intentName});
            })
       
    })
    const cleanedTests = testObjectArray.filter(test => test.Question.length > 0 );
    
    lexTester.processTests(cleanedTests, app.get('botName'), process.env["BOT_ALIAS"])
    .then((results) => {
          
          console.log(results.slice(-3).map((item) => (`${item.ResultIntent} ${item.Match} ${item.NoAnswer}`)));
          res.render('results',{resultsOverview:results.slice(-3), results:results.slice(0,results.length -3 ),writeResults:convert,allResults:results});
          
    })
    
});

app.get("/", (req, res) => {
    res.render("upload");
});



app.listen(3000, () => {
  console.log("server started on port 3000");
});

const convertObjectValuesToArray = (object) => {
    const modifiedObject = {}
    for (const key in object){
        if(! Array.isArray(object[key])){
            modifiedObject[key] = [object[key]]
        }
        else{
            modifiedObject[key] = object[key]
        }
    }
    return modifiedObject;
}

