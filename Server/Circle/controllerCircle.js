const db = require('../Database/database.js');
const cons = require('./constants.js');

module.exports = {
    helloworld : function (req, res) {
      res.status(200).json({
        query: req.query,
        message: 'Hello World!'
      });
    },

    removeUser : function (req, res) {
        const userId = req.body.userId;
        const circleId = req.body.circleId;

        if (argumentMissing(res, circleId, userId)) return;

        const reqUserId = req.session.userId;

        db.UserInCircles.findOne({where: {"UserId" : reqUserId, "CircleId" : circleId}}).then(result => {
            if (result[0][0].role == cons.CircleRole.ADMINISTRATOR){
                db.UserInCircles.findOne({where: {"UserId" : userId, "CircleId" : circleId}}).then(result => {
                    result.destroy();
                    res.send("User from circle removed.");
                }).error(err => {
                    res.status(404);
                    res.send("User not found in circle.");
                });
            }else{
                res.status(403);
                res.send("Permission denied. User who made the request is not Admin in the requested circle.")
            }
        }).error(err => {
            res.status(404);
            res.send("User not found in circle.");
        return;
    });
        res.send("User from circle removed.");
    },

    joinOpenCircle : function (req, res) {
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
                    res.send("User added to circle.");
                    return;
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
    },

    newCircle : function (req, res) {
        const name = req.body.name;
        const visible = req.body.vis;
        const location = req.body.loc;

        if (argumentMissing(res, name, visible, location)) return;
        if (argumentMissing(res, location.lat, location.lon)) return; // aus gründen -.-

        const userId = req.session.userId;

        db.Circle.create({"name":name,"visible":visible}).then(circle => {
            // Location speichern
            db.Location.create({"longitude" : location.lon*1.0, "latitude" : location.lat*1.0}).then(locationObj => {
                locationObj.addCircle(circle);
            });
            // Ersteller als Admin zum Circle hinzufügen
            db.User.findOne({where: {"id" : userId}}).then(user => {
                circle.addUser(user).then(result => {
                    // TODO: Abfrage result == []
                    result[0][0].update({"role" : cons.CircleRole.ADMINISTRATOR});
                    res.send("Circle created and User added.");
                });
            }).error(err => {
                res.status(404)
                res.send("User from session not found.");
            });;
        }).error(err => {
            res.status(500)
            res.send("Server error. Creating circle failed.");
        });
    },

    editCircle : function (req,res) {
        const circleId = req.body.id;
        const visible = req.body.vis;

        if (argumentMissing(res, circleId, visible)) return;

        const userId = req.session.userId; //TODO: wer darf alles circle bearbeiten?

        db.Circle.findById(circleId)
        .then(circle => {
          circle.updateAttributes({
            //name: req.body.name,
            "visible": visible
          })
          res.send("OK");
        }).error(err => {
          res.status(500);
          res.send("Save changes failed.")
        });
    },

    removeCircle : function (req, res) {
        const circleId = req.body.id;

        if (argumentMissing(res, circleId)) return;

        const userId = req.session.userId; //TODO: nur Admin darf löschen

        db.Circle.build({"id" : circleId}).destroy();

        res.send("Circle removed.");
    },

    //return all circles the user is following
    circlesForUserId : function (req, res) {
        const userId = req.session.userId;

        db.User.findAll({where: {id: userId}, include: [db.Circle]}).then(result => {
            // console.log(result[0].Circles);
            if (result[0] && result[0].Circles){
                const circles = result[0].Circles;
                let data = [];
                circles.forEach(circle => {
                    data.push({"name": circle.name, "id": circle.id});
                });
                res.send({"circles": data});
            }else{
                res.status(404);
                res.send("No circles for this user.");
            };
        }).catch(err => {
            res.status(500);
            res.send("Getting data from database failed.")
        });

        // res.send({circles: [{name:"DHBW",id:1}]});
    },

    //returns all circles at a certain distance(km) to a point(lat/long)
    circlesForLocation : function (req, res) {
        const location = req.body.loc;
        // const Distance = req.body.dist;

        db.Circle.findAll().then(circles => {
          // circles.forEach(circle => {
          //   console.log(circle.getLocations());
          // });
          res.status(200).json(
            circles
          );
        });
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
        const circleId = req.query.id;

        if (argumentMissing(res, circleId)) return;

        const userId = req.session.userId;

        db.Circle.build({"id" : circleId}).getUsers({attributes: ["id","name"]}).then(users => {
            var data = [];
            var userInCircle = false;
            users.forEach(element => {
                data.push({uuid: element.id, username: element.name});
                if(!userInCircle && element.id == userId) userInCircle = true;
            });
            if(userInCircle){
                res.send(data);
            }else{
                res.status(403);
                res.send("Permission denied. User who made the request is not in the requested circle.")
            }
        }).error(err => {
            res.status(500);
            res.send("Server Error");
        });
    },

    getModules : function(req, res){
      const circleId = req.query.circleId;

      if (argumentMissing(res, circleId)) return;

      db.Circle.findById(circleId).then(circle => {
          if(circle == null){
            res.status(404).send("No circle with given id.");
            return;
          }
          var result = {modules: []};
          if(circle.blackboard){
            result.modules.push("blackboard");
          }
          if(circle.calendar){
            result.modules.push("calendar");
          }
          if(circle. bill){
            result.modules.push("bill");
          }
          if(circle.bet){
            result.modules.push("bet");
          }
          if(circle.filesharing){
            result.modules.push("filesharing");
          }
          if(circle.chat){
            result.modules.push("chat");
          }
          if(circle.market){
            result.modules.push("market");
          }
          res.send(result);
          return;
      }).error(err => {
          res.status(500).send("Error.");
          return;
      });
    },

    getVisibility : function(req, res){
      var circleId = req.query.circleId
      db.Circle.findById(circleId).then(circle => {
        if(circle == null){
          res.status(404).send("No circle with given id.");
          return;
        }
        res.send(circle.visible);
        return;
      }).error(err => {
        res.status(500).send("Error");
        return;
      });
    }

};

function argumentMissing(res, ...args){
    if(!args.every(arg => {return arg != undefined;})){
        res.status(400);
        res.send("Bad request. Argument(s) missing.")
        return true;
    }
    return false;
}
