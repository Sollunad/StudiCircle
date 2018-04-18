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
      const title = req.body.title;
      const description = req.body.description;
      const location = req.body.location;
      const startDate = req.body.startDate;
      const endDate =  req.body.endDate;
      const allDay = req.body.allDay;
      const circleId= req.body.circleId;

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

      db.Calendar.Appointment.create({"title":title,"description":description||null,"location":location,"startDate":startDate||null,"endDate":endDate||null,"allDay":allDay||null,"countCommits":0,"countRejections":0,"countInterested":0,"circleId":circleId}).then(calendar => {
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

    const appID = req.body.appID;
    const title = req.body.title;
    const description = req.body.description;
    const location = req.body.location;
    const startDate = req.body.startDate;
    const endDate =  req.body.endDate;
    const allDay = req.body.allDay;


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

  //voting: wert des Enums wie abgestimmt wurde
  //appId : id des termins für den abgestimmt wurde
  //Methode zum abstimmen für einen Termin ändert getätigte abstimmung falls bereits abgestimmt wurde
  vote : function (req,res){
    const voting = req.body.voting;
    const appID = req.body.appID;
    const userId = req.session.userId;


    if(argumentMissing(res, voting, appID, userId)) return;

    db.Calendar.Vote.findOne({where: {"user" : userId, "appId":appID}}).then(vote => {
      vote.updateAttributes({'vote': voting});
      sendInfoResponse(res, "Vote updated");
      return;
    }).catch(err => {
      sendInfoResponse(res, 500, "Server error. Voting failed.");
      return;
    });

    db.Calender.Vote.create({'appID': appID, 'user': userId, 'vote':voting}).then(vote =>{
      sendInfoResponse(res, "Vote sent");
    }).catch(err => {
      sendInfoResponse(res, 500, "Server error. Voting failed.");
    });

  },

  //appID: id des Termins für den man die Abstimmung möchte
  //methode zum abrufen der Abstimmung zu einem Termin
  getVoting : function (req,res){
    const appID = req.query.appID;

    if(argumentMissing(res,appID)) return;

    db.Calendar.Appointment.findById(appID).then(calendar => {
      if(calendar == null){
        sendInfoResponse(res, 404, "No appointment with given id.");
        return;
      }


      const resultjson = {};


      if(calendar.dataValues.countCommits){
        resultjson.commits=calendar.dataValues.countCommits;
      }else {
        resultjson.commits=0;
      }
      if(circle.dataValues.countRejections){
        resultjson.rejections=calendar.dataValues.countRejections;
      }else {
        resultjson.commits=0;
      }
      if(calendar.dataValues.countInterested){
        resultjson.interested=calendar.dataValues.countInterested;
      }else {
        resultjson.commits=0;
      }

      console.log(resultjson);

      res.send(resultjson);
    }).catch(err => {
        sendInfoResponse(res, 500, "Error getting votes.");
    });
  },



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
