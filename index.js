const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io")
const io = new Server(server);

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/controller', (req, res) => {
  res.sendFile(__dirname + '/controller.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('create_room', (msg) => {
    console.log('A room is created, ID: ' + msg);
  });

  socket.on('join_room', (msg) => {
    io.emit('player_joining', msg);
    console.log('Controller Id:' + msg.controllerId, ' is joined in Room Id:' + msg.roomId);
  });

  socket.on('confirm_joining', (msg) => {
    io.emit('controller_confirm', msg);
    console.log('Room:' + msg.roomId, ' confirms Controller Id:' + msg.controllerId, ' is joined as Player ' + msg.playerRole);
  });

  socket.on('start_game', (msg) => {
    io.emit('start_game', msg);
    console.log('Room:' + msg.roomId, 'starts game');
  });

  socket.on('send_controller_command', (msg) => {
    io.emit('get_controller_command', msg);
    console.log('Controller Id:' + msg.controllerId, ' sends command ' + msg.command + ' to Room Id: ' + msg.roomId);
  });

  socket.on('send_winner', (msg) => {
    io.emit('get_winner', msg);
    console.log('Room:' + msg.roomId, 'determines the Winner is Controller Id:' + msg.winner);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});