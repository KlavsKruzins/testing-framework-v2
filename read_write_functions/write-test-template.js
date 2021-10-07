const fs = require('fs');

const getCurrentDateTime = (short = false) => {
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var d = new Date();
var day = days[d.getDay()];
var hr = d.getHours();
var min = d.getMinutes();
if (min < 10) {
    min = "0" + min;
}
var ampm = "am";
if( hr > 12 ) {
    hr -= 12;
    ampm = "pm";
}
var date = d.getDate();
var month = months[d.getMonth()];
var year = d.getFullYear();
const dateString = day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year;
const shortString =  day + "-" + hr + "-" + min + ampm + "-" + date + "-" + month + "-" + year;
if(short == true) return shortString;
return dateString;
}

console.log(getCurrentDateTime());

const writeTestCase = (tests) => {
const time = getCurrentDateTime();
const fileName = getCurrentDateTime(true);
const testCase = {
    name:time,
    testUtterances: {}
}


for (const key in tests) {
       if(!tests[key].some(Boolean)){
           delete tests[key];
           continue;
       }
      testCase.testUtterances[key] = tests[key].filter(e => e);
}
const json = JSON.stringify(testCase);
fs.writeFile(`./test_cases/${fileName}.json`, json, 'utf8', ()=>{
    console.log('Done Writing')
});
}

module.exports = {writeTestCase, getCurrentDateTime};
