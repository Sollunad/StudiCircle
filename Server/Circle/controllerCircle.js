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

/*        function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1);
            var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            return d;
        }*/
    },

    members : function (req, res) {
        var circleId = req.body.id;
        res.send([
            {uuid:1, username:"Hans"},
            {uuid:2, username:"Peter"}
        ]);
    },

};
