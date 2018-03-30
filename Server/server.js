var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var session = require('client-sessions');
var student = require('./Student/moduleInterface')
var app = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
  cookieName: 'session',
  secret: 'F4Z4o@fKNjZzY!ymm%1F&tBGigJ%VG', // key zur Verschlüsselung der Session-Daten
  duration: 30 * 60 * 1000, // 30 min gültigkeit des cookies
  activeDuration: 5 * 60 * 1000, // 5 min verlängerung bei jeder Anfrage des clients
  cookie: {
    httpOnly: false, // when true, cookie is not accessible from javascript
    secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
  }
}));

// urls protecten
const allowedUrls = ["/user/login",
                        "/user/logout",
                        "/user/forgotPassword",
                        "/user/register",
                    ];
const allowedWildcards = ["/user/activate/",
                            "/user/resetPassword/",
                            "/user/changeMail/",
                        ];
app.route('/circle/*').all(authorize);
app.route('/user/*').all(authorize);

var routesCircle = require('./Circle/routerCircle'); //importing route
routesCircle(app); //register the route

var routesStudents = require('./Student/routerStudent'); //importing route
routesStudents(app); //register the route

const port = 8080;
app.listen(port);
console.log('todo list RESTful API server started on: ' + port );

function authorize(req, res, next){
    var url = req.originalUrl
    if (allowedUrls.includes(url) || containsWildcard(url) ){
        next();
    }else if (req.session && req.session.userId){
        var userExists = false;
        try {
            userExists = student.userExists(req.session.userId);
        } catch (err) {
        }
        if (userExists) {
            next();
        } else {
            responseWhenUnauthorized(req, res);
        }
    }else {
        responseWhenUnauthorized(req, res);
    }
}

function containsWildcard(url){
    for (var wildcard of allowedWildcards) {
        if (url.startsWith(wildcard)) {
            return true;
        }
    }
    return false;
}

function responseWhenUnauthorized (req, res) {
    req.session.reset();
    res.status(401);
    res.send("Unauthorized! Failed in Server.js");
}
