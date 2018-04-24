const db = require('../../Database/database.js');
const cons = require('./constants.js');


module.exports = {

  //title: name für den Termin
  //descriotion: beschreibung für den Termin
  //location: Ort des Termins
  //startDate: Anfang des Termins
  //endDate: Ende des Termins
  //allday: flag ob termin den ganzen TAg dauert
  //circleId: Id des Circles für den der Termin erstellt wird
  //Methode legt termin mit den entsprechenden Attributen an.
  createAppointment : function (req, res) {
      const title = req.body.appointment.title;
      const description = req.body.appointment.description;
      const location = req.body.appointment.location;
      const startDate = req.body.appointment.startDate;
      const endDate =  req.body.appointment.endDate;
      const allDay = req.body.appointment.allDay;
      const circleId = req.body.circleId;
	  console.log(circleId);

      if (argumentMissing(res, title, location)) return;
      if (allDay == null || !allDay){
          if (argumentMissing(res,startDate,endDate)) return;
      }
      if (startDate && endDate){
        if(allDay){
          sendInfoResponse(res,400, "Invalid Input")
          return;
        }
      }

      db.Calendar.Appointment.create({"title":title,"description":description||null,"location":location,"startDate":startDate||null,"endDate":endDate||null,"CircleId":circleId}).then(calendar => {
        sendInfoResponse(res, "Appointment Created");
      }).catch(err => {
          sendInfoResponse(res, 500, "Server error. Creating appointment failed.");
      });
  },

  //appID: Id des Termins
  //title: name für den Termin
  //descriotion: beschreibung für den Termin
  //location: Ort des Termins
  //startDate: Anfang des Termins
  //endDate: Ende des Termins
  //allday: flag ob termin den ganzen TAg dauert
  //Methode bearbeitet die Attribute entsprechend.
  editAppointment : function(req,res){

    const appID = req.body.appointmentId;
    const title = req.body.appointment.title;
    const description = req.body.appointment.description;
    const location = req.body.appointment.location;
    const startDate = req.body.appointment.startDate;
    const endDate =  req.body.appointment.endDate;
    const allDay = req.body.appointment.allDay;


    if (argumentMissing(res, title, location, appID)) return;
    if (allDay == null || !allDay){
        if (argumentMissing(res,startDate,endDate)) return;
    }
    if (startDate && endDate){
      if(allDay){
        sendInfoResponse(res,400, "Invalid Input")
        return;
      }
    }

    db.Calendar.Appointment.findById(appID)
    .then(calendar => {
      calendar.updateAttributes({
        "title": title,
        "description": description,
        "location": location,
        "startDate": startDate,
        "endDate": endDate,
        "allDay": allDay,
      });
      sendInfoResponse(res, "Appointment eddited");
    }).catch(err => {
      sendInfoResponse(res, 500, "Save changes failed.");
    });

  },

  delete : function (req,res){
    const appID = req.body.appointmentId;

    if(argumentMissing(res,appID)) return;
    db.Calendar.Vote.findAll({where: {"AppointmentId": appID}}).then(voting => {
      if (voting[0]){
        voting.forEach(vote =>{
          vote.destroy();
        })
      }
    }).catch(err => {
      sendInfoResponse(res, 500, "1 Server error. deletion failed.");
      return;
    });
    db.Calendar.Appointment.findById(appID).then(appointment => {
      if(appointment){
        appointment.destroy();
        sendInfoResponse(res,  "Successful deleted");
        return;
      }else{
        sendInfoResponse(res, 400, "no Appointment with given id");
        return;
      }

    }).catch(err => {
      sendInfoResponse(res, 500, "2 Server error. deltion failed.");
      return;
    });
  },

  //voting: wert des Enums wie abgestimmt wurde
  //appId : id des termins für den abgestimmt wurde
  //Methode zum abstimmen für einen Termin ändert getätigte abstimmung falls bereits abgestimmt wurde
  vote : function (req,res){
    const voting = req.body.voting;
    const appID = req.body.appointmentId;
    const userId = req.session.userId;


    if(argumentMissing(res, voting, appID, userId)) return;

    db.Calendar.Vote.findOne({where: {"UserId" : userId, "AppointmentId":appID}}).then(vote => {
      if(vote){
        if(voting < 3){
          vote.updateAttributes({'vote': voting});
          sendInfoResponse(res, "Vote updated");
          return;
        }else{
          vote.destroy();
          sendInfoResponse(res, "Vote updated");
          return;
        }
      }else{
        if(voting < 3){
          db.Calendar.Vote.create({'AppointmentId': appID, 'UserId': userId, 'vote':voting}).then(vote =>{
            sendInfoResponse(res, "Vote sent");
            return;
          }).catch(err => {
            sendInfoResponse(res, 500, "Server error. Voting failed.");
            return;
          });
        }else {
          sendInfoResponse(res, 500, "No voting sent");
        }
      }
  }).catch(err => {
      sendInfoResponse(res, 500, "Server error. Voting failed.");
      return;
    });

  },

  //appID: id des Termins für den man die Abstimmung möchte
  //methode zum abrufen der Abstimmung zu einem Termin
  getVoting : function (req,res){
    const appID = req.query.appID;

    if(argumentMissing(res,appID)) return;

    db.Calendar.Vote.findAll({where: {"AppointmentId": appID}}).then(voting => {
      if (voting[0]){
        var commits =0;
        var rejections = 0;
        var interested = 0;
          voting.forEach(vote => {
              if(vote.dataValues.vote == 0){
                interested = interested +1;
              }else if (vote.dataValues.vote == 1) {
                rejections = rejections +1;
              }else if (vote.dataValues.vote == 2) {
                  commits = commits +1;
              }
          });
          res.send({'commits':commits, 'rejections':rejections, 'interested': interested});
      }else{
          sendInfoResponse(res, 404, "No Votes for this Appointment.");
      }
    }).catch(err => {
      console.log(err);
      sendInfoResponse(res, 500, "Error getting votes.");
    });
  },

  getVotingDetails : function (req,res){
    const appID = req.query.appID;

    if(argumentMissing(res,appID)) return;

    var result = [];
    db.Calendar.Vote.findAll({where: {"AppointmentId": appID}, include: [db.User]}).then(voting => {
      voting.forEach(vote => {
        result.push({"name": vote.User.name, "vote": vote.dataValues.vote});
        console.log(result);
      });
      console.log(result);
      res.status(200).send(result);
    }).catch(err => {
      sendInfoResponse(res, 500, "Error geting Votes");
    });
  },

  //circleID: die ID des Circle für den man die Termine haben möchte
  //gibt alle Termine des angegeben Circles zurück
  getAllAppointments : function(req, res){
	console.log(req.session);
    const circleID = req.query.circleID;
    const userID =   req.session.userId;

    if(argumentMissing(res,circleID, userID)) return;
    var result = [];
    db.Calendar.Appointment.findAll({where: {"CircleId": circleID}, include: [db.Calendar.Vote]}).then(appointments => {
      appointments.forEach(appointment => {
        var uservote = 3;
        var commits = 0;
        var rejections = 0;
        var interested = 0;
        if(appointment.dataValues.Votes){
          appointment.dataValues.Votes.forEach(vote => {
            if(vote.dataValues.UserId == userID){
              uservote = vote.dataValues.vote;
            }
            if(vote.dataValues.vote == 0){
              interested = interested +1;
            }else if (vote.dataValues.vote == 1) {
              rejections = rejections +1;
            }else if (vote.dataValues.vote == 2) {
              commits = commits +1;
            }

          });
        }

        var votejsn = {"countCommits": commits, "countRejections": rejections, "countInterested": interested, "userVote": uservote};
        var obj = Object.assign(appointment.dataValues, votejsn)
        result.push(obj);
      });
      res.status(200).send(result);
    }).catch(err => {
      console.log(err);
      sendInfoResponse(res, 500, "Error getting Appointments");
    });
  }

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

function argumentMissing(res, ...args){
    if(!args.every(arg => {return arg != undefined;})){
        sendInfoResponse(res, 400, "Bad request. Argument(s) missing.")
        return true;
    }
    return false;
}
