module.exports = function(app){
  console.log("[CHAT.JS]");
  const db = require('../../Database/database.js');
  const session = require('../../Session/session.js')
  const http = require('http').Server(app);
  const io = require('socket.io')(http);

  io.on('connection', (socket) => {
    console.log("[CONNECT]");
    // console.log("request: " + socket.request);
    // console.log(socket.request._query);
    // console.log(socket.request._query.sessionId);
    // socket.sessionData = session.getSessionData(socket.request._query.sessionId);
    // console.log(socket.sessionData);

    socket.on('disconnect', function(){
      io.emit('users-changed', {user: socket.nickname, event: 'left'});
    });

    socket.on('set-nickname', (nickname) => {
      console.log("[SET-NICKNAME]");
      socket.nickname = nickname;
      io.emit('users-changed', {user: nickname, event: 'joined'});
    });

    socket.on('add-message', (message) => {
      io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});
    });
  });
}
