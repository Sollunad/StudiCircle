var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var activation = require('./Student/activateUser');
var registration = require('./Student/registration');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/testStudent', function (req, res) {
    res.send('Test started...');
});

app.get('/changePassword', function (req, res) {
    res.send('Hello Test!');
});

app.get('/activateNewUser', function (req, res) {
    activation.activateNewUser(req.query.uuid);
    res.send('Validating UUID '+req.query.uuid +'!');
});

//post registration
app.post("/registration", function (req, res) {
    console.log("test1");
    var mailAddress = req.body.mail;
    var password = req.body.pwd;
    var accountType = req.body.type;

    registration.register(mailAddress, password, accountType,res);
});

app.post("/*", function (req, res) {
    console.log("wrong url");
    res.writeHead(404, 'Error', {'Content-Type': 'text/plain'});
});

app.listen(8080);
