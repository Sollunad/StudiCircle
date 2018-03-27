const db = require('../Database/database.js');
const cons = require('./constants.js');

module.exports = {
    helloworld : function (req, res) {
        res.send('Hello World!');
    },

    removeUser : function (req, res) {
        const userId = req.body.userId;
        const circleId = req.body.circleId;

        if (argumentMissing(res, circleId, userId)) return;

        db.UserInCircles.findOne({where: {"UserId" : userId, "CircleId" : circleId}}).then(result => {
            result.destroy();
        }).error(err => {
            res.status(404);
            res.send("User in circle not found.");
            return;
        });

        res.send("User from circle removed.");
    },

    addUser : function (req, res) {
        const circleId = req.body.circleId;
        const userId = req.body.userId;
        //const userRole = req.body.role;

        if (argumentMissing(res, circleId, userId)) return;

        db.Circle.findById(circleId).then(circle => {
            if(!circle.visible) {
                res.status(400);
                res.send("Bad request. Circle not public.")
                return;
            }
            db.User.findById(userId).then(user => {
                circle.addUser(user).then(result => {
                    result[0][0].update({"role" : cons.CircleRole.MEMBER});
                });
            }).error(err => {
                res.status(404);
                res.send("No user with given id.");
                return;
            });
        }).error(err => {
            res.status(404);
            res.send("No circle with given id.");
            return;
        });

        res.send("User added to circle.");
    },

    newCircle : function (req, res) {
        var newCircle = {};
        newCircle.name = req.body.name;
        newCircle.visible = req.body.vis;

        var location = req.body.loc;

        db.Circle.create(newCircle);
        res.send(newCircle);
    },

    removeCircle : function (req, res) {
        var circleId = req.body.id;
        res.send(userId);
    },

    circlesForUserId : function (req, res) {
        var userId = req.body.id;
        res.send(userId);
    },

    circlesForLocation : function (req, res) {
        var location = req.body.loc;
        res.send(location);
    },

    members : function (req, res) {
        var circleId = req.body.id;
        res.send([
            {uuid:1, username:"Hans"},
            {uuid:2, username:"Peter"}
        ]);
    },
};

function argumentMissing(res, ...args){
    if(!args.every(arg => {return arg != undefined;})){
        res.status(400);
        res.send("Bad request. Argument(s) missing.")
        return true;
    }
    return false;
}
