const db = require('../../Database/database.js');
const cons = require('./constants.js');


module.exports = {
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

      db.Calendar.create({"title":title,"description":description||null,"location":location,"startDate":startDate||null,"endDate":endDate||null,"allDay":allDay||null,"circleId":circleId}).then(calendar => {
        sendInfoResponse(res, "Appointment Created");
      }).catch(err => {
          sendInfoResponse(res, 500, "Server error. Creating appointment failed.");
      });
  },

  editAppointment : function(req,res){

    const appID = req.body.appID;
    const title = req.body.title;
    const description = req.body.description;
    const location = req.body.location;
    const startDate = req.body.startDate;
    const endDate =  req.body.endDate;
    const allDay = req.body.allDay;


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

    db.Calendar.findById(appID)
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

  vote : function (req,res){
    const voting = req.body.voting;
    const appID = req.body.appID;

    if(argumentMissing(res, voting)) return;

    if(voting == cons.Votings.COMMIT){
      db.Calendar.increment('countCommits', { where: { id: appID }}).then(calendar => {
        sendInfoResponse(res, "Vote sent");
      }).catch(err => {
          sendInfoResponse(res, 500, "Server error. Voting failed.");
      });
    }else if(voting == cons.Votings.REJECT){
      db.Calendar.increment('countRejections', { where: { id: appID }}).then(calendar => {
        sendInfoResponse(res, "Vote sent");
      }).catch(err => {
          sendInfoResponse(res, 500, "Server error. Voting failed.");
      });
    }else if(voting == cons.Votings.INTERESTED){
      db.Calendar.increment('countInterested', { where: { id: appID }}).then(calendar => {
        sendInfoResponse(res, "Vote sent");
      }).catch(err => {
          sendInfoResponse(res, 500, "Server error. Voting failed.");
      });
    }else {
      sendInfoResponse(res, 500, "Server error. No Valid Vote.")
    }

  },

  getVoting : function (req,res){
    const appID = req.query.appID;

    if(argumentMissing(res,appID)) return;

    db.Calendar.findById(appID).then(calendar => {
      if(calendar == null){
        sendInfoResponse(res, 404, "No appointment with given id.");
        return;
      }
      const result = [];
      if(calendar.countCommits){
        result.push("countCommits");
      }
      if(circle.countRejections){
        result.push("countRejections");
      }
      if(calendar.countInterested){
        result.push("countInterested");
      }

      const resultjson = {"commits":result[0],"rejections":result[1],"interested":result[2]}
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
