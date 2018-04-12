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
                    sendInfoResponse(res, "User from circle removed.");
                    return;
                }).error(err => {
                    sendInfoResponse(res, 404, "User not found in circle.");
                    return;
                });
            }else{
                sendInfoResponse(res, 403, "Permission denied. User who made the request is not Admin in the requested circle.");
                return;
            }
        }).error(err => {
            sendInfoResponse(res, 404, "User not found in circle.");
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
                sendInfoResponse(res, 400, "Bad request. Circle not public.");
                return;
            }
            db.User.findById(userId).then(user => {
                circle.addUser(user).then(result => {
                    if(result[0]){
                        result[0][0].update({"role" : cons.CircleRole.MEMBER});
                        sendInfoResponse(res, "User added to circle.");
                        return;
                    }else{
                        sendInfoResponse(res, "User already in circle.");
                        return;
                    }
                });
            }).error(err => {
                sendInfoResponse(res, 404, "No user with given id.");
                return;
            });
        }).error(err => {
            sendInfoResponse(res, 404, "No circle with given id.");
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
                        sendInfoResponse(res, "Circle created and User added.");
                    }else{
                        sendInfoResponse(res, "User already in circle.");
                    }
                });
            }).error(err => {
                sendInfoResponse(res, 404, "User from session not found.");
            });;
        }).error(err => {
            sendInfoResponse(res, 500, "Server error. Creating circle failed.");
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
          sendInfoResponse(res, 500, "Save changes failed.");
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
          "filesharing": file,
          "market": market
        });
        sendInfoResponse(res, "OK");
      }).error(err => {
        sendInfoResponse(res, 500, "Save changes failed.");
      });

    },

    removeCircle : function (req, res) {
        const circleId = req.body.id;

        if (argumentMissing(res, circleId)) return;

        const userId = req.session.userId; //TODO: nur Admin darf löschen

        db.Circle.build({"id" : circleId}).destroy();

        sendInfoResponse(res, "Circle removed.");
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
                sendInfoResponse(res, 404, "No circles for this user.");
            }
        }).catch(err => {
            res.status(500);
            sendInfoResponse(res, 500, "Getting data from database failed.");
        });

        // res.send({circles: [{name:"DHBW",id:1}]});
    },

    //returns all circles at a certain distance(km) to a point(lat/long)
    circlesForLocation : function (req, res) {
      const lat1 = req.query.lat;
      const lon1 = req.query.lon;
      const distance = req.query.dist;

      const deg2rad = (deg) => deg * (Math.PI/180);
      const distanceBetweenCoords = (lat2, lon2) => {
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
      const circleFilter = (circle) => {
        return circle.Locations.some(circleLocation => {
            var coordDistance = distanceBetweenCoords(
              circleLocation.latitude,
              circleLocation.longitude
            );
            return coordDistance <= distance;
          });
      }

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

        var filteredCircles = circles.filter(circleFilter);
        res.status(200).json(filteredCircles);
      }).error(err => {
        res.status(500).json({
          'error': 'Server Error'
        });
      });
    },

    members : function (req, res) {
        const circleId = req.query.id;

        if (argumentMissing(res, circleId)) return;

        const userId = req.session.userId;

        db.Circle.build({"id" : circleId}).getUsers().then(users => {
            var data = [];
            var userInCircle = false;
            users.forEach(element => {
                data.push({uuid: element.id, username: element.name, role: element.UserInCircles.role});
                if(!userInCircle && element.id == userId) userInCircle = true;
            });
            if(userInCircle){
                res.send(data);
            } else {
                sendInfoResponse(res, 403, "Permission denied. User who made the request is not in the requested circle.");
            }
        }).error(err => {
            res.status(500);
            sendInfoResponse(res, 500, "Server Error");
        });
    },

    getModules : function(req, res){
      const circleId = req.query.circleId;

      if (argumentMissing(res, circleId)) return;

      db.Circle.findById(circleId).then(circle => {
          if(circle == null){
            sendInfoResponse(res, 404, "No circle with given id.");
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
          sendInfoResponse(res, 500, "Error.");
          return;
      });
    },

    getVisibility : function(req, res){
      var circleId = req.query.circleId;
      db.Circle.findById(circleId).then(circle => {
        if(circle == null){
          sendInfoResponse(res, 404, "No circle with given id.");
          return;
        }
        res.send(circle.visible);
        return;
      }).error(err => {
        sendInfoResponse(res, 500, "Error");
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
				sendInfoResponse(res, "Changed Role for " + selectedUser.toString()
						+ " to " + newRole
						+ "in Circle " + circleId + ".");
			}).error((error) => {
                sendInfoResponse(res, 500, "Update failed.");
			});
		}).error((error) => {
            sendInfoResponse(res, 500, "Could not find user in circle.");
		});
	},

    newAdmin : function(req, res){
        const circleId = req.body.circleId;
        const newAdminId = req.body.userId;

        if(argumentMissing(res, circleId, newAdminId)) return;

        const oldAdminId = req.session.userId;
        // const dummyRes = {status : function(){}, send : function(){}};

        if(newAdminId == oldAdminId){
            sendInfoResponse(res, 400, "New and old admin are the same.");
            return;
        }

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
                                sendInfoResponse(res, "Admin changed.");
                			}).error((error) => {
                                sendInfoResponse(res, 500,"Update of new Admin failed.");
                			});
                		}).error((error) => {
                            sendInfoResponse(res, 500, "Could not find new admin user in circle.");
                		});
        			}).error((error) => {
                        sendInfoResponse(res, 500, "Update of old admin failed.");
        			});
        		}).error((error) => {
                    sendInfoResponse(res, 500, "Could not find old admin user in circle.");
        		});
            }else{
                sendInfoResponse(res, 403, "Permission denied. User who made the request is not admin in the requested circle.");
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
                sendInfoResponse(res, 400, "Bad request. User ist not in the circle.");
            }
        }).error(err => {
            sendInfoResponse(res, 500, "Server error at database request.");
        })
    },

    leaveCircle : function(req, res){
        const circleId = req.body.circleId
        if (argumentMissing(res, circleId)) return;
        const userId = req.session.userId;

        db.UserInCircles.findOne({where: {"UserId": userId, "CircleId": circleId}}).then(result => {
            if(result && result.role != cons.CircleRole.ADMINISTRATOR){
                result.destroy();
                sendInfoResponse(res, "User left circle.");
            }else{
                sendInfoResponse(res, 400, "User not in circle or user is admin.");
            }
        }).error(err => {
            sendInfoResponse(res, 500, "Database error.");
        });
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
    },

    getPosts: function(req, res) {
        const circleId = req.query.circleId;

        // TODO: db implementation
        // db.Circle.findAll({
        //     include: [{
        //         model: db.Blackboard,
        //         //  required: false     --> LEFT OUTER JOIN (auch Circles ohne Location)
        //     }]
        // }).then(circles => {
        //     res.status(200).json(circles);
        // });

        res.status(200).json([
            {
                postID: 1,
                userName: 'TestUser',
                title: 'First Title',
                text: 'Toller Post',
                date: '20170406',
                comments: [
                    {postID: 11, userName: 'TestUserComment11', text: 'Comment: 11', date: '20170406'},
                    {postID: 12, userName: 'TestUserComment12', text: 'Comment: 12', date: '20170406'},
                    {postID: 13, userName: 'TestUserComment13', text: 'Comment: 13', date: '20170406'},
                    {postID: 14, userName: 'TestUserComment14', text: 'Comment: 14', date: '20170406'},
                    {postID: 15, userName: 'TestUserComment15', text: 'Comment: 15', date: '20170406'}
                ]
            },
            {
                postID: 2,
                userName: 'TestUser2',
                title: 'Second Title',
                text: 'Test',
                date: '20170406',
                comments: [{
                    postID: 21, userName: 'TestUserComment21', text: 'Comment: Test', date: '20170406'
                }]
            }
        ]);
    },

    getBlackboardPosts: function(req, res){
        const circleId = req.query.circleID;

        db.Blackboard.Post.findAll({where: {CircleId: circleId}, include: [{model: db.User, attributes: ['id', 'name'] },
                {model: db.Blackboard.Comment, include: [db.User], limit: 3},
            ], order: [['createdAt', 'DESC']]}).then(result => {
            if(result.length === 0){
            res.send({msg: 'No Circles'});
            return;
        }
    else{
            console.log(result);
            res.status(200).send(result);
            return;
        }
    }).error(err => {
            res.status(500).send("Error while reading posts");
        return;
    });
    },


    newPost: function(req, res) {
        const circleId = req.body.circleId;
        const userId = req.body.userId;
        const title = req.body.title;
        const text = req.body.text;
        const date = new Date();

        // TODO: db implementation

        // if(argumentMissing(res, circleId, userId, title, text)) return;

        res.status(200).json({
            postID: 1,
            userName: 'User' + userId,
            title: title,
            text: text,
            date: date,
            comments: []
        });
    },

    newComment : function(req, res){

    },

    getComments: function(req, res){
        const postID = req.query.postID
        db.Blackboard.Comment.findAll({where: {Postid: postID}, include: [{model: db.User, attributes: ['id', 'name']},
            ], order:[['createdAt', 'ASC']]}).then(result => {
            if(result.length === 0){
            res.send({msg: 'No Comments'});
            return;
        }else{
            console.log(result);
            res.status(200).send(result);
            return;
        }
    }).error(err => {
            res.status(500).send("Error while reading comments");
        return;
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
        sendInfoResponse(res, 400, "Bad request. Argument(s) missing.")
        return true;
    }
    return false;
}

function sendInfoResponse(res, var1, var2){
    if(typeof var1 == "string"){
        res.status(200);
        res.send({"info" : var1});
    }else{
        res.status(var1 || 200);
        res.send({"info" : var2});
    }

}
