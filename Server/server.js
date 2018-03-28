var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// ionic erlauben auf die REST Endpoints zuzugreifen
app.get('/*',function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

var routesCircle = require('./Circle/routerCircle'); //importing route
routesCircle(app); //register the route

app.listen(8080);

console.log('todo list RESTful API server started on: 8080');

var routesStudents = require('./Student/routerStudent'); //importing route
routesStudents(app); //register the route
