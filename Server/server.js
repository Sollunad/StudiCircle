var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var routes = require('./Student/routerStudent'); //importing route
routes(app); //register the route

app.listen(8080);

console.log('todo list RESTful API server started on: 8080');