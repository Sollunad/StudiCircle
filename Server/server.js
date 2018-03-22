var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/test', function (req, res) {
    res.send('Hello Test!');
});

//post registration
app.post("/registration", function (req, res) {

    var mailAddress = req.body.mail;
    var password = req.body.pwd;
    var accountType = req.body.type;

    var registration = require('./Student/registration');
    registration.register(mailAddress,password,accountType,res);
});

app.post("/*", function (req, res) {
    console.log("wrong url");
    res.writeHead(404, 'Error', {'Content-Type': 'text/plain'});
});

app.listen(8080);
