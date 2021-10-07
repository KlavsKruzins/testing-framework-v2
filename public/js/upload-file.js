const path = require('path');
const formidable = require('formidable');
const fs = require('fs');


async function upload_file(req,res,app){
  if(req.method == "POST") {
     // create an incoming form object
     var form = new formidable.IncomingForm();
     let file_path;
     // specify that we want to allow the user to upload multiple files in a single request
     form.multiples = false;
     // store all uploads in the /uploads directory
     form.uploadDir = path.basename(path.dirname('/uploads/json_files/'))
     // every time a file has been uploaded successfully,
     // rename it to it's orignal name
     form.on('file', function(field, file) {
       fs.rename(file.path, path.join(form.uploadDir, file.name), function(err){
           if (err) throw err;
           file_path = '/uploads/'+file.name
           app.set('filePath',file_path);
       });
     });
     // log any errors that occur
     form.on('error', function(err) {
         console.log('An error has occured: \n' + err);
     });
     // parse the incoming request containing the form data
     form.parse(req);
   }
}

 module.exports = {upload_file};