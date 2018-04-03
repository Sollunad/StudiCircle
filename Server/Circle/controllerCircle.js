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
        const name = req.body.name;
        const visible = req.body.vis;
        //const location = req.body.loc;

        if (argumentMissing(res, name, visible)) return;

        const userId = 1 //TODO session ???

        db.Circle.create({"name":name,"visible":visible}).then(circle => {
            db.User.findOne({where: {"id" : userId}}).then(user => {
                circle.addUser(user).then(result => {
                    result[0][0].update({"role" : cons.CircleRole.ADMINISTRATOR});
                    res.send("Circle created and User added.");
                });
            }).error(err => {
                res.status(404)
                res.send("User from session not found.");
            });;
        }).error(err => {
            res.status(500).json({
              error: 'Server error'
            });
        });
    },

    editCircle : function (req,res) {
        const circleId = req.body.id;
        const visible = req.body.vis;

        if (argumentMissing(res, circleId, visible)) return;

        db.Circle.findById(circleId)
        .then(circle => {
          circle.updateAttributes({
            //name: req.body.name,
            "visible": visible
          })
          res.send();
        })
    },

    removeCircle : function (req, res) {
        const circleId = req.body.id;

        if (argumentMissing(res, circleId)) return;

        const userId = 1 //TODO session handling?

        db.Circle.build({"id" : circleId}).destroy();

        res.send("Circle removed.");
    },

    //return all circles the user is following
    circlesForUserId : function (req, res) {
        var userId = req.body.id;
        var circles = db.User.findAll({where: {id: 1}, include: [db.Circle]}).then(result => {
          var json = res.json({circles: result[0].Circles});
          //res.send(circles);
        }).catch(err => {
        res.status(500);
        res.send("Internal Server Error");
        //console.log(err);});
        //console.log(circles);
      });
    },

    //returns all circles at a certain distance(km) to a point(lat/long)
    circlesForLocation : function (req, res) {
      const deg2rad = (deg) => deg * (Math.PI/180);
      const distanceBetweenCoords = (lat1, lon1, lat2, lon2) => {
        // console.log('distanceBetweenCoords', lat1, lon1, lat2, lon2);

        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
      }

      const lat1 = req.query.lat;
      const lon1 = req.query.lon;
      const distance = req.query.dist;

      if (argumentMissing(res, lat1, lon1, distance)) return;

      db.Circle.findAll({
        include: [{
          model: db.Location,
      //  required: false     --> LEFT OUTER JOIN (auch Circles ohne Location)
         }]
      }).then(circles => {

        if(distance == -1) {
          res.status(200).json(circles);
          return;
        }

        let json = [];

        circles.forEach(circle => {

          circle.Locations.forEach(circleLocation => {

            var lat2 = circleLocation.latitude;
            var lon2 = circleLocation.longitude;

            var coordDistance = distanceBetweenCoords(lat1, lon1, lat2, lon2);
            if (coordDistance <= distance){
              json.push(circle);
            }
          });
        });

        res.status(200).json(json);
      }).error(err => {
        res.status(500).json({
          'error': 'Server Error'
        });
      });
    },

    members : function (req, res) {
        const circleId = req.query.id;

        if (argumentMissing(res, circleId)) return;

        const userId = 1 //TODO: get by session

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

};

function argumentMissing(res, ...args){
    if(!args.every(arg => {return arg != undefined;})){
        res.status(400);
        res.send("Bad request. Argument(s) missing.")
        return true;
    }
    return false;
}
