//convert.js
const fs = require('fs');
const {getCurrentDateTime} = require('./write-test-template.js');
const date = getCurrentDateTime(true);
var json2xls = require('json2xls');

const filename = `./results/${date}.xlsx`;

var convert = function (json) {
  var xls = json2xls(json);
  fs.writeFileSync(filename, xls, 'binary', (err) => {
     if (err) {
           console.log("writeFileSync :", err);
      }
    
 });
 
}

 module.exports = {convert}