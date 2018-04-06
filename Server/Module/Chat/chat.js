module.exports = function(app, server){
  const db = require('../../Database/database.js');
  const session = require('../../Session/session.js')
  const http = require('http').Server(app);
  const io = require('socket.io')(http, { path: '/socket/socket.io'}).listen(server);

  io.on('connection', (socket) => {
    socket.sessionData = session.getSessionData(socket.request._query.sessionId);
    socket.circleId = Number(socket.request._query.circleId);
    if(socket.sessionData) socket.userId = socket.sessionData.userID;
    console.log("[CHAT.JS]sessionData: " + socket.sessionData);
    console.log("[CHAT.JS]circleId: " + socket.circleId);
    console.log("[CHAT.JS]userId: " + socket.userId);
    socket.join(socket.circleId);
    db.User.findById(socket.userId).then(user => {
      socket.userName = user.name;
      console.log("[CHAT.JS]userName:" + socket.userName);
      io.to(socket.circleId).emit('users-changed', {user: socket.userName, event: 'joined'});
    });

    socket.on('disconnect', function(){
      io.to(socket.circleId).emit('users-changed', {user: socket.userName, event: 'left'});
    });

    socket.on('add-message', (message) => {
      var created = new Date();
      db.ChatMessage.create({"body": message.text, "time": created, "CircleId": socket.circleId, "UserId": socket.userId});
      io.to(socket.circleId).emit('message', {text: message.text, from: socket.userName, created: created});
    });
  });

  // REST-Schnittstelle um die letzten 30 Nachrichten eines bestimmten Circles zu bekommen
  app.route('/chat/getFirst30Messages').get(function(req, res){
    var circleId = req.query.circleId;
    var result = [];
    db.ChatMessage.findAll({
      where: {circleId: circleId},
      limit: 30,
      order: [['time', 'DESC']],
      include: [db.User]
    }).then(messages => {
      messages.forEach(function(item, index){
        result.push({
          "text": item.body,
          "from": item.User.name,
          "created": item.time
        })
      })
      res.send(result);
    }).error(function(){
      res.status(500).send("Error");
    })
  });
}
