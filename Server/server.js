var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var routesCircle = require('./Circle/routerCircle'); //importing route
routesCircle(app); //register the route

app.listen(8080);

console.log('todo list RESTful API server started on: 8080');

var routesStudents = require('./Student/routerStudent'); //importing route
routesStudents(app); //register the route
