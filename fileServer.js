const fs = require('fs');
const express = require("express");
var request = require('request');
var config = JSON.parse(fs.readFileSync('serverConfig.json', 'utf8'));

const appFileExchange = express();
const port = config.serverPort;
const dataFolder = config.filePath
const requestFile = config.requestFileLocation;
const serverHst = config.hstServerAddress;
const serverHstPort = config.hstServerPort;

const appStateControl = express();
const statusFilePath = config.statusFilePath;
const statusPort = config.statusPort;
const statusFileName = config.statusFileName;

appFileExchange.use(express.static(dataFolder));
appStateControl.use(express.static(statusFilePath));

///REST API:
appFileExchange.get('/', function (req, res) {
  var msgToBrowser = `Server ok. Listening folder : ${dataFolder}`
  console.log("get called");
  res.send(msgToBrowser);
});

appFileExchange.get('/sanityCheck', function (req,res){
    res.send(config);
});
appFileExchange.get('/ls', function(req,res){
    readDirFiles(function(dirContent){
        res.send(dirContent)
    });
});

appFileExchange.listen(port, function(){
  console.log("Listening on port: " + port);
});

var readDirFiles = function(callback){    
    fs.readdir(dataFolder, (err, files) => {
        callback(files);
        files.forEach(file => {
            console.log(file);
            });
        });
    }

var requestHstFile = function(date){
    request.get("http://"+serverHst+":"+serverHstPort+"/"+date, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        
        fs.writeFile(dataFolder+"\\"+date, body, function(err) {
        if(err) {
            return console.log(err);
            }});
    }
});
}

appStateControl.get('/', function (req, res) {
    readDirFilesState(function(dirContent){
        res.send(dirContent)
    });
});

var readDirFilesState = function(callback){    
    fs.readdir(statusFilePath, (err, files) => {
        callback(files);
        files.forEach(file => {
            console.log(file);
            });
        });
    }

appStateControl.listen(statusPort, function(){
  console.log("Listening on port: " + statusPort);
});

setInterval(function(){
    fs.readFile(requestFile, 'ascii', function(err,data){
    if(data!=""){
        requestHstFile(data);
        fs.writeFile(requestFile,"",function(){});
        }
    });

},1000);

