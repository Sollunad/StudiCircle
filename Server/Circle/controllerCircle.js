const db = require('../Database/database.js');
const cons = require('./constants.js');

const consUser = require('../Student/constants.js');
const studentInterface = require('../Student/moduleInterface.js');

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
                }).catch(err => {
                    sendInfoResponse(res, 404, "User not found in circle.");
                });
            }else{
                sendInfoResponse(res, 403, "Permission denied. User who made the request is not Admin in the requested circle.");
            }
        }).catch(err => {
            sendInfoResponse(res, 404, "User not found in circle.");
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
                    }else{
                        sendInfoResponse(res, "User already in circle.");
                    }
                });
            }).catch(err => {
                sendInfoResponse(res, 404, "No user with given id.");
            });
        }).catch(err => {
            sendInfoResponse(res, 404, "No circle with given id.");
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
        var circleIsBusiness = false;
        const userData = studentInterface.getUserData(userId);
        if (userData.type = 'BUSINESS') {circleIsBusiness = true;}

        db.Circle.create({"name":name,"visible":visible,"business":circleIsBusiness,"blackboard":true,"calendar":true,"bill":false,"bet":false,"filesharing":false,"chat":true,"market":false}).then(circle => {
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
                        if(user.type == consUser.AccountType.BUSINESS) circle.updateAttributes({"business":true});
                        sendInfoResponse(res, "Circle created and User added.");
                    }else{
                        sendInfoResponse(res, "User already in circle.");
                    }
                });
            }).catch(err => {
                sendInfoResponse(res, 404, "User from session not found.");
            });
        }).catch(err => {
            sendInfoResponse(res, 500, "Server error. Creating circle failed.");
        });
    },

    editCircle : function (req,res) {
        const circleId = req.body.id;
        const visible = req.body.vis;

        if (argumentMissing(res, circleId, visible)) return;

        const userId = req.session.userId;

        isAdminInCircle(userId, circleId, result => {
            if(result){
                db.Circle.findById(circleId)
                .then(circle => {
                    circle.updateAttributes({
                        "visible": visible
                    });
                    sendInfoResponse(res,  "OK");
                }).catch(err => {
                    sendInfoResponse(res, 500, "Save changes failed.");
                });
            }else{
                sendInfoResponse(res, 400, "User is no admin in circle.");
            }
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

        const userId = req.session.userId;

        isAdminInCircle(userId, circleId, result => {
           if(result){
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
                    }).catch(err => {
                    sendInfoResponse(res, 500, "Save changes failed.");
                });
           }else{
               sendInfoResponse(res, 412, "User is not admin in circle.");
           }
        });

    },

    removeCircle : function (req, res) {
        const circleId = req.body.id;

        if (argumentMissing(res, circleId)) return;

        const userId = req.session.userId;

        isAdminInCircle(userId, circleId, result => {
           if(result){
                db.Circle.build({"id" : circleId}).destroy();
                sendInfoResponse(res, "Circle removed.");
           } else{
               sendInfoResponse(res, 400, "You are not admin in the circle.");
           }
        });

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
      }).catch(err => {
        res.status(500).json({
          'error': 'Server Error'
        });
      });
    },

    members : function (req, res) {
        const circleId = req.query.id;
        var germanRoleName = "";

        if (argumentMissing(res, circleId)) return;

        const userId = req.session.userId;

        db.Circle.build({"id" : circleId}).getUsers().then(users => {
            const data = [];
            let userInCircle = false;
            users.forEach(element => {
                if(element.UserInCircles.role === "admin"){
                    germanRoleName = "(Administrator)";
                }else if (element.UserInCircles.role === "mod"){
                    germanRoleName = "(Moderator)";
                }else if (element.UserInCircles.role === "member"){
                    germanRoleName = "";
                }
                data.push({uuid: element.id, username: element.name, role: element.UserInCircles.role, germanRole: germanRoleName});
                if(!userInCircle && element.id == userId) userInCircle = true;
            });
            if(userInCircle){
                res.send(data);
            } else {
                sendInfoResponse(res, 403, "Permission denied. User who made the request is not in the requested circle.");
            }
        }).catch(err => {
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
          const result = [];
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
      }).catch(err => {
          sendInfoResponse(res, 500, "Error.");
      });
    },

    getVisibility : function(req, res){
        const circleId = req.query.circleId;
        db.Circle.findById(circleId).then(circle => {
        if(circle == null){
          sendInfoResponse(res, 404, "No circle with given id.");
          return;
        }
        res.send(circle.visible);
      }).catch(err => {
        sendInfoResponse(res, 500, "Error");
      });
    },

	changeRole : function(req, res) {
		const circleId = req.body.circleId,
			selectedUser = req.body.userId,
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
			}).catch((error) => {
                sendInfoResponse(res, 500, "Update failed.");
			});
		}).catch((error) => {
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
                			}).catch((error) => {
                                sendInfoResponse(res, 500,"Update of new Admin failed.");
                			});
                		}).catch((error) => {
                            sendInfoResponse(res, 500, "Could not find new admin user in circle.");
                		});
        			}).catch((error) => {
                        sendInfoResponse(res, 500, "Update of old admin failed.");
        			});
        		}).catch((error) => {
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
        }).catch(err => {
            sendInfoResponse(res, 500, "Server error at database request.");
        })
    },

    leaveCircle : function(req, res){
        const circleId = req.body.circleId;
        if (argumentMissing(res, circleId)) return;
        const userId = req.session.userId;

        db.UserInCircles.findOne({where: {"UserId": userId, "CircleId": circleId}}).then(result => {
            if(result && result.role != cons.CircleRole.ADMINISTRATOR){
                result.destroy();
                sendInfoResponse(res, "User left circle.");
            }else{
                sendInfoResponse(res, 400, "User not in circle or user is admin.");
            }
        }).catch(err => {
            sendInfoResponse(res, 500, "Database error.");
        });
    },

    inviteToCircle : function(req, res){
        const mail = req.body.mail;
        const circleId = req.body.circleId;

        if (argumentMissing(res, mail, circleId)) return;

        const userId = req.session.userId;

        isModOrAboveInCircle(userId, circleId, (result) => {
            if(result){
                db.User.findOne({where: {"email": mail}}).then(user => {
                    if(user){
                        db.UserInCircles.findOne({where: {"UserId": user.id, "CircleId": circleId}}).then(userInCircle => {
                            if(!userInCircle){
                                db.Invitation.create({"UserId": user.id, "CircleId": circleId, "status":0}).then(result =>{
                                    if(result) sendInfoResponse(res, "Invitation sent.");
                                });
                            }else{
                                sendInfoResponse(res, 400, "User already in circle.");
                            }
                        });
                    }else{
                        db.Circle.findById(circleId).then(circle => {
                            if(circle.business){
                                if(studentInterface.sendInvitation(userId,mail,circleId)){
                                    sendInfoResponse(res, "Invitation sent to not registered user.");
                                }else{
                                    sendInfoResponse(res, 500, "External email error.")
                                }
                            }else{
                                sendInfoResponse(res, 409, "No user with given email found.");
                            }
                        });
                    }
                }).catch(err => {
                    sendInfoResponse(res, 500, "Database fail.");
                });
            }else{
                sendInfoResponse(res, 403, "Permission denied. User who made the request is not admin or mod in the circle.");

            }
        });
    },

    allInvitationsPerUser : function(req, res){
        const userId = req.session.userId;

        db.Invitation.findAll({where: {"UserId": userId, "status": 0}, include: [{model: db.Circle}]}).then(result => {
            if(result && result.length > 0){
                let resultData = [];
                result.forEach(invit => {
                   resultData.push({"invitId": invit.id, "cId": invit.CircleId, "cName": invit.Circle.name});
                });
                res.send(resultData);
            }else{
                const resultData = [{"invitId": null, "cId": null, "cName": "No invitations found."}];
                res.send(resultData);
            }
        }).catch(err => {
            sendInfoResponse(res, 500, "Database error.");
        })
    },

    allInvitationsPerCircle : function(req, res){
        const circleId = req.query.circleId;

        if(argumentMissing(res, circleId)) return;

        db.Invitation.findAll({where: {"CircleId": circleId}, include: [{model: db.User}]}).then(result => {
            if(result && result.length > 0){
                let resultData = [];
                result.forEach(invit => {
                    resultData.push({"invitId": invit.id, "user": invit.User.name, "status": invit.status});
                });
                res.send(resultData);
            }else{
                //const resultData = [{"invitId": null, "cId": null, "cName": "No invitations found."}];
                res.send([]);
            }
        }).catch(err => {
            sendInfoResponse(res, 500, "Database error.");
        })
    },

    reactToInvitation : function(req, res){
        const invitationId = req.body.invitId;
        const isAccepted = req.body.status;

        if(argumentMissing(res, invitationId, isAccepted)) return ;

        const userId = req.session.userId;

        db.Invitation.findOne({where: {"id": invitationId, "UserId": userId, "status": 0}}).then(invit => {
            if(invit){
                if(isAccepted){
                    db.UserInCircles.create({"UserId": userId, "CircleId": invit.CircleId, "role": cons.CircleRole.MEMBER}).then(result => {
                        invit.updateAttributes({"status": 2});
                        sendInfoResponse(res,"Invitation accepted.");
                    }).catch(err => {
                        sendInfoResponse(res, 409, "User already in circle. Or some database error.");
                    });
                }else{
                    invit.updateAttributes({"status": 1});
                    sendInfoResponse(res,"Invitation rejected.");
                }
            }else{
                sendInfoResponse(res, 400, "No valid invitation found.");
            }
        }).catch(err => {
            sendInfoResponse(500, "Database error.");
        });
    },

    deleteInvitation : function(req, res){
        const invitId = req.body.invitId;

        if(argumentMissing(res, invitId)) return;

        const userId = req.session.userId;

        db.Invitation.findById(invitId).then(invit => {
            if(invit && invit.status > 0){
                isModOrAboveInCircle(userId, invit.CircleId, result => {
                   if(result){
                        invit.destroy();
                   }else{
                       sendInfoResponse(res, 412, "User do not have permission to delete an invitation.");
                   }
                });
            }else{
                sendInfoResponse(res, 400, "No invitation with given id. Or invitation is still open.");
            }
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
    },
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

function isModOrAboveInCircle(userId, circleId, callback){
    db.UserInCircles.findOne({
        where: {CircleId: circleId, UserId: userId}
    }).then(result => {
        if(result && result.role != cons.CircleRole.MEMBER){
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
