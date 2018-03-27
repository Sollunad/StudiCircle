var db = require('../Database/circle.js');

module.exports = {
    helloworld : function (req, res) {
        res.send('Hello World!');
    },

    removeUser : function (req, res) {
        var userId = req.body.id;
        res.send(userId);
    },

    addUser : function (req, res) {
        var userId = req.body.id;
        res.send(userId);
    },

    newCircle : function (req, res) {
        var name = req.body.name;
        var visible = req.body.vis;
        var location = req.body.loc;
        db.Circle.create({name: name, visible: visible});
        res.send(name + " " + visible);
    },

    removeCircle : function (req, res) {
        var circleId = req.body.id;
        res.send(userId);
    },

    //return all circles the user is following
    circlesForUserId : function (req, res) {
        var userId = req.body.id;
        var circles = db.UsersCircles.findAll({where: {userID: 1}});
        res.send({user: 1});
    },

    circlesForLocation : function (req, res) {
        var location = req.body.loc;
        res.send(location);
    },

    members : function (req, res) {
        var circleId = req.body.id;
        res.send([
            {id:1, name:"Hans"},
            {id:2, name:"Peter"}
        ]);
    },

};
