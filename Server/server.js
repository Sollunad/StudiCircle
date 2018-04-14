var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var student = require('./Student/moduleInterface');
var mySession = require('./Session/session');
var sessionConstants = require('./Session/constants');

var app = express();

const port = 8080;

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    //credentials : true
}

app.use(cors(corsOptions));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// urls protecten
const allowedUrls = ["/user/login",
                        "/user/test",
                        "/user/trigger",
                        "/user/logout",
                        "/user/forgotPassword",
                        "/user/resetPassword",
                        "/user/register",
                    ];
const allowedWildcards = ["/user/activate/",
                            "/user/disable/",
                            "/user/resetPassword/",
                            "/user/changeMail/",
                        ];
app.route('/circle/*').all(authorize);
app.route('/user/*').all(authorize);

var routesCircle = require('./Circle/routerCircle'); //importing route
routesCircle(app); //register the route

var routesStudents = require('./Student/routerStudent'); //importing route
routesStudents(app); //register the route

var server = app.listen(port);
console.log('todo list RESTful API server started on: ' + port );

// timeout sessions
setInterval(mySession.cleanSessions, sessionConstants.SESSION_TIMEOUT_CHECK_INTERVALL);
console.error('[SESSION] Registerd Session Timer');


function authorize(req, res, next){
    var url = req.originalUrl;
    var sessionID = req.body.mySession || req.query.mySession;
    req.session = {};
    req.session.sessionId = sessionID;

    if (allowedUrls.includes(url) || containsWildcard(url) ){
        next();
    }else if (sessionID){
        const sessionData = mySession.getSessionData(sessionID);
        if (!sessionData || !sessionData.userID) {
            console.log("[SESSION] no valid session found");
            responseWhenUnauthorized(req, res);
            return;
        }
        req.session.userId = sessionData.userID;
        next();
    } else {
        console.log("[SESSION] no session id given");
        responseWhenUnauthorized(req, res);
        return;
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
    mySession.invalidate(req.session.sessionId);
    res.status(401);
    res.send("Unauthorized! Failed in Server.js");
}

//Sockets
var chat = require('./Module/Chat/chat.js')(app, server);
