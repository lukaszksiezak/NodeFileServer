const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const dataFolder = process.argv[2];

var listOfFiles = [];

app.use(express.static(__dirname));
app.use(express.static(dataFolder));

app.get('/', function (req, res) {
  var msgToBrowser = `Server ok. Listening folder : ${dataFolder}`
  res.send(msgToBrowser);
});

http.listen(1337, function () {
  console.log('Listening on localhost:1337');
});

//Read file 
fs.readFile(dataFolder+"\\testData", 'ascii', function(err,data){
    console.log(data);
});

var readDirFiles = function(){
    fs.readdir(dataFolder, (err, files) => {
        files.forEach(file => {
            listOfFiles.push(file);
            console.log(file);
            });
        });
    }

