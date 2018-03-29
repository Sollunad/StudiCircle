var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var session = require('client-sessions');
var app = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
  cookieName: 'session',
  secret: 'F4Z4o@fKNjZzY!ymm%1F&tBGigJ%VG', // key zur Verschlüsselung der Session-Daten
  duration: 30 * 60 * 1000, // 30 min gültigkeit des cookies
  activeDuration: 5 * 60 * 1000, // 5 min verlängerung bei jeder Anfrage des clients
}));

// urls protecten
app.route('/circle/*').all(authorize);
app.route('/user/*').all(authorize);

var routesCircle = require('./Circle/routerCircle'); //importing route
routesCircle(app); //register the route

console.log('todo list RESTful API server started on: 8080');

var routesStudents = require('./Student/routerStudent'); //importing route
routesStudents(app); //register the route

app.listen(8080);


function authorize(req, res, next){
    if(req.session && req.session.userId){
        // eventuell checken ob UserID wirklich exestiert
        next();
    }else{
        req.session.reset();
        res.status(401);
        res.send("Unauthorized!");
    }
}
