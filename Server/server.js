var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');

var app = express();

//CORS middleware
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*.sknx.de');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//
//     next();
// }

//app.all('*', function(req, res, next) {
  //  res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //res.header('Access-Control-Allow-Headers', 'Content-Type');
    //next();
//});

// Add headers
// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// ionic erlauben auf die REST Endpoints zuzugreifen
app.get('/*',function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
    next();
});

var routesCircle = require('./Circle/routerCircle'); //importing route
routesCircle(app); //register the route

app.listen(8080);

console.log('todo list RESTful API server started on: 8080');

var routesStudents = require('./Student/routerStudent'); //importing route
routesStudents(app); //register the route
