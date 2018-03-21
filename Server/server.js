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
    var mailPassword = process.env.StudicircleMailPwd;

    var mailAddress = req.body.mail;
    var password = req.body.pwd;
    var accountType = req.body.type;

    var nodemailer = require('nodemailer');

    var smtpConfig = {
        host: 'smtp.web.de',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'studicircle@web.de',
            pass: mailPassword
        }
    };

    var transporter = nodemailer.createTransport(
        smtpConfig
    );

    var mailOptions = {
        from: 'Studicircle <studicircle@web.de>',
        to: mailAddress,
        subject: 'Studicircle: Validate Your mail address',
        html:
        '<html lang="de-DE">\n' +
        '<head>\n' +
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
        '</head>\n' +
        '<body>\n' +
        '<p>Please click on following link to register to Studicircle: <a href="http://localhost:8080/test">Validate E-Mail</a></p>' +
        '</body>\n' +
        '</html>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send('Error at sending verification link.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Send verification link.');
        }
    });
});

app.post("/*", function (req, res) {
    console.log("wrong url");
    res.writeHead(404, 'Error', {'Content-Type': 'text/plain'});
});

app.listen(8080);
