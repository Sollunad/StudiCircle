module.exports = function(app, server){
  const db = require('../../Database/database.js');
  const session = require('../../Session/session.js')
  const http = require('http').Server(app);
  const io = require('socket.io')(http, { path: '/socket/socket.io'}).listen(server);

  io.on('connection', (socket) => {
    socket.sessionData = session.getSessionData(socket.request._query.sessionId);
    socket.circleId = Number(socket.request._query.circleId);
    if(socket.sessionData) socket.userId = socket.sessionData.userID;

    socket.join(socket.circleId);
    db.User.findById(socket.userId).then(user => {
      socket.userName = user.name;
      io.to(socket.circleId).emit('users-changed', {user: socket.userName, event: 'joined'});
    });

    socket.on('disconnect', function(){
      io.to(socket.circleId).emit('users-changed', {user: socket.userName, event: 'left'});
    });

    socket.on('add-message', (message) => {
      var created = new Date();
      db.ChatMessage.create({"body": message.text, "time": created, "CircleId": socket.circleId, "UserId": socket.userId})
      .then(createdMessage => {
        io.to(socket.circleId).emit('message', {text: message.text,
                                                from: socket.userName,
                                                created: created,
                                                userId: socket.userId,
                                                messageId: createdMessage.id});
      });
    });
    //TODO testen!!!!!
    socket.on('delete-message', (data) => {
      db.ChatMessage.destroy({where: {id: data.messageId}}).then(() => {
        io.to(socket.circleId).emit('message-deleted', {id: data.messageId});
      });
    });
  });

  // REST-Schnittstelle um Nachrichten für einen bestimmten Circle zu bekommen
  // offset: die Anzahl an Nachrichten, die übersprungen werden sollen, also nicht geladen werden
  // limit: die Anzahl an Nachrichten, die geladen werden sollen
  // liefert ein Array mit Nachrichten und eine Flag (moreMessagesExist), ob es darüber hinaus noch weitere Nachrichten gibt
  app.route('/chat/getMessages').get(function(req, res){
    var offset = Number(req.query.offset);
    var limit = Number(req.query.limit);
    var circleId = req.query.circleId;
    var result = {};
    result.messages = [];
    var moreMessagesExist = false;
    db.ChatMessage.findAll({
      where: {circleId: circleId},
      offset: offset,
      limit: limit + 1,
      order: [['time', 'DESC']],
      include: [db.User]
    }).then(messages => {
      messages.forEach(function(item, index){
        if(index < limit){
          result.messages.unshift({
            "text": item.body,
            "from": item.User.name,
            "created": item.time,
            "userId": item.User.id,
            "messageId": item.id
          })
        }
        else{
          moreMessagesExist = true;
        }
      })
      result.moreMessagesExist = moreMessagesExist;
      res.send(result);
    }).error(function(){
      res.status(500).send("Error");
    })
  });
}
