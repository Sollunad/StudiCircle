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

        db.UserInCircles.findOne({where: {"UserId" : reqUserId, "CircleId" : circleId}}).then(result1 => {
            if (result1 && result1.role == cons.CircleRole.ADMINISTRATOR){
                db.UserInCircles.findOne({where: {"UserId" : userId, "CircleId" : circleId}}).then(result2 => {
                    result2.destroy();
                    res.send("User from circle removed.");
                    return;
                }).error(err => {
                    res.status(404);
                    res.send("User not found in circle.");
                    return;
                });
            }else{
                res.status(403);
                res.send("Permission denied. User who made the request is not Admin in the requested circle.")
                return;
            }
        }).error(err => {
            res.status(404);
            res.send("User not found in circle.");
            return;
        });
        // res.send("User from circle removed.");
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
                    if(result[0]){
                        result[0][0].update({"role" : cons.CircleRole.MEMBER});
                        res.send("User added to circle.");
                        return;
                    }else{
                        res.send("User already in circle.");
                        return;
                    }
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

        if (argumentMissing(res, name, visible)) return;
        if (location !== null && location){
            if (argumentMissing(res, location.lat, location.lon)) return; // aus gründen -.-
        }

        const userId = req.session.userId;

        db.Circle.create({"name":name,"visible":visible,"blackboard":true,"calendar":true,"bill":true,"bet":true,"filesharing":true,"chat":true,"market":true}).then(circle => {
            // Location speichern
            if (location !== null){
                db.Location.create({"longitude" : location.lon*1.0, "latitude" : location.lat*1.0}).then(locationObj => {
                    locationObj.addCircle(circle);
                });
            }
            // Ersteller als Admin zum Circle hinzufügen
            db.User.findOne({where: {"id" : userId}}).then(user => {
                circle.addUser(user).then(result => {
                    if (result[0]){
                        result[0][0].update({"role" : cons.CircleRole.ADMINISTRATOR});
                        res.send("Circle created and User added.");
                    }else{
                        res.send("User already in circle.");
                    }
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

        if (argumentMissing(res, circleId, visible, calendar, bill, bet, file, market)) return;

        const userId = req.session.userId; //TODO: wer darf alles circle bearbeiten?

        db.Circle.findById(circleId)
        .then(circle => {
          circle.updateAttributes({
            "visible": visible,
            "calendar": calendar,
            "bill": bill,
            "bet": bet,
            "filesharing": filesharing,
            "market": market
          })
          res.send("OK");
        }).error(err => {
          res.status(500);
          res.send("Save changes failed.")
        });
    },

    editModules : function (req,res) {
      const circleId = req.body.id;

      const calendar = req.body.calendar;
      const bill = req.body.bill;
      const bet = req.body.bet;
      const file = req.body.file;
      const market = req.body.market;

      if (argumentMissing(res, circleId, calendar, bill, bet, file, market)) return;

      const userId = req.session.userId; //TODO: wer darf alles circle bearbeiten?

      db.Circle.findById(circleId)
      .then(circle => {
        circle.updateAttributes({
          "calendar": calendar,
          "bill": bill,
          "bet": bet,
          "filesharing": filesharing,
          "market": market
        });
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
                res.send(data);
            }else{
                res.status(404);
                res.send("No circles for this user.");
            }
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
          var result = [];
          if(circle.blackboard){
            result.push("blackboard");
          }
          if(circle.calendar){
            result.push("calendar");
          }
          if(circle. bill){
            result.push("bill");
          }
          if(circle.bet){
            result.push("bet");
          }
          if(circle.filesharing){
            result.push("filesharing");
          }
          if(circle.chat){
            result.push("chat");
          }
          if(circle.market){
            result.push("market");
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
    },

	changeRole : function(req, res) {
		const circleId = req.body.circle,
			selectedUser = req.body.user,
			newRole = req.body.role;

        if(argumentMissing(res, circleId, selectedUser, newRole)) return;

		db.UserInCircles.findOne({
			where: {
				CircleId: circleId,
				UserId: selectedUser
			}
		}).then((relation) => {
			relation.update({
				role: newRole
			}).then(() => {
				res.status(200)
					.send("Changed Role for " + selectedUser.toString()
						+ " to " + newRole
						+ "in Circle " + circleId + ".");
			}).error((error) => {
				res.status(500).send("Update failed.");
			});
		}).error((error) => {
			res.status(500).send("Could not find user in circle.");
		});
	},

    newAdmin : function(req, res){
        const circleId = req.body.circleId;
        const newAdminId = req.body.userId;

        if(argumentMissing(res, circleId, newAdminId)) return;

        const oldAdminId = req.session.userId;
        // const dummyRes = {status : function(){}, send : function(){}};

        isAdminInCircle(oldAdminId, circleId, result => {
            if(result){
                // module.exports.changeRole({query: {
                //     "circle": circleId,
                //     "user": newAdminId,
                //     "role": cons.CircleRole.ADMINISTRATOR,
                // }},dummyRes);
                // module.exports.changeRole({query: {
                //     "circle": circleId,
                //     "user": oldAdminId,
                //     "role": cons.CircleRole.MEMBER,
                // }},res);
                db.UserInCircles.findOne({where: { "CircleId": circleId, "UserId": newAdminId}}).then(result1 => {
                    // change a user to admin
        			result1.update({"role": cons.CircleRole.ADMINISTRATOR}).then(() => {
                        db.UserInCircles.findOne({where: { "CircleId": circleId, "UserId": oldAdminId}}).then(result2 => {
                            // change old admin to member
                            result2.update({"role": cons.CircleRole.MEMBER}).then(() => {
                                res.send("Admin changed.");
                			}).error((error) => {
                				res.status(500).send("Update of new Admin failed.");
                			});
                		}).error((error) => {
                			res.status(500).send("Could not find new admin user in circle.");
                		});
        			}).error((error) => {
        				res.status(500).send("Update of old admin failed.");
        			});
        		}).error((error) => {
        			res.status(500).send("Could not find old admin user in circle.");
        		});
            }else{
                res.status(403);
                res.send("Permission denied. User who made the request is not admin in the requested circle.");
            }
        });
    },

    getRole : function(req, res){
        const circleId = req.query.circleId;
        if(argumentMissing(res, circleId)) return;
        const userId = req.session.userId;

        db.UserInCircles.findOne({
            where: {UserId: userId, CircleId: circleId}
        }).then(result => {
            if(result){
                res.send({"role": result.role});
            }else{
                res.status(400);
                res.send("Bad request. User ist not in the circle.")
            }
        }).error(err => {
            res.status(500);
            res.send("Server error at database request.")
        })
    },

    leaveCircle : function(req, res){
        //TODO
    },

    // keine geroutete function
    isAdminAnywhere : function(userId, callback){
        db.UserInCircles.findAll({
            where: {UserId: userId, role: cons.CircleRole.ADMINISTRATOR}
        }).then(result => {
            if(result.length > 0){
                if(callback) callback(true);
            }else{
                if(callback) callback(false);
            }
        });
    }


};

// locale Funktionen

function isAdminInCircle(userId, circleId, callback){
    db.UserInCircles.findOne({
        where: {CircleId: circleId, UserId: userId}
    }).then(result => {
        if(result && result.role == cons.CircleRole.ADMINISTRATOR){
            if(callback) callback(true);
        }else{
            if(callback) callback(false);
        }
    });
}

function argumentMissing(res, ...args){
    if(!args.every(arg => {return arg != undefined;})){
        res.status(400);
        res.send("Bad request. Argument(s) missing.");
        return true;
    }
    return false;
}
