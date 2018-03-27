var express = require('express');
var app = express();

var bodyParser = require('body-parser');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*.sknx.de');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var routesStudents = require('./Student/routerStudent'); //importing route
routesStudents(app); //register the route

app.listen(8080);


console.log('RESTful API server started on: 8080');
