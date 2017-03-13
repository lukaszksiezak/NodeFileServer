const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.argv[2]
const dataFolder = process.argv[3];
const dataFile = process.argv[4];

var listOfFiles = [];

app.use(express.static(__dirname));
app.use(express.static(dataFolder));

app.get('/', function (req, res) {
  var msgToBrowser = `Server ok. Listening folder : ${dataFolder}`
  res.send(msgToBrowser);
});

http.listen(port, function () {
  console.log('Listening on localhost:' + port);
});

//Read file 
fs.readFile(dataFolder+"\\"+dataFile, 'ascii', function(err,data){
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

