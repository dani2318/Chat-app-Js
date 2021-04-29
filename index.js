const express = require("express")
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
      console.log(msg[0]+" , "+msg[1])
      var messaggio = msg[1] + ": " + msg[0]
      io.emit('chat message', messaggio);
    });
    socket.on('user name',(msg) =>{
        console.log(msg)
    });
  });

server.listen(3000, () => {
    console.log('listening on *:3000');
});