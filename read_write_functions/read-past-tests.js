const fs = require('fs');
const path = require('path')

const getAllTestCases =  () => {
    const directoryPath = path.join(__dirname, 'test_cases');
//passsing directoryPath and callback function
const files =  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    return files;
});
console.log(`From Inside: ${files}`)
return files;
}

const readDirectoryPromise = () => {
    const directoryPath = path.join(__dirname, 'test_cases');
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }

module.exports = {readDirectoryPromise}