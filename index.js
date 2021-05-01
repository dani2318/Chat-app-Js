const express = require("express")
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const utenti=[""]

app.use(express.static(__dirname + '/public'));
app.get('/public', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/style.css');
  res.sendFile(__dirname + '/img/*');
  res.sendFile(__dirname + '/js/*');
});

io.on('connection', (socket) => {

  socket.on('connected', (msg) => {
    var res = `${msg} si è connesso alla chat`
    io.emit('response', res);
  })

  socket.on('message', (msg) => {
    console.log(msg[0] + " , " + msg[1])
    var messaggio = msg[1] + ": " + msg[0]
    io.emit('chat message', messaggio);
  });
  
  io.emit('user online',utenti)

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});