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
}
