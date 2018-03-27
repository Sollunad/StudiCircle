var db = require('../Database/database.js');

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
        var newCircle = {};
        newCircle.name = req.body.name;
        newCircle.visible = req.body.vis;

        var location = req.body.loc;

        db.Circle.create(newCircle);
        res.send(name + " " + visible);
    },

    editCircle : function (req,res) {
      db.Circle.findById(req.body.id);
      .on('success', function (circle) {
        // Check if record exists in db
        if (circle) {
          db.circle.updateAttributes({
            name: req.body.name,
            //vis:  req.body.vis
          })
        .success(function () {})
        }
      })
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
