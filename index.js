const express = require("express")
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const utenti=[];
const room = ["MainChat"];
var utentiOnlineConta = utenti.length;

app.use(express.static(__dirname + '/public'));
app.get('/public', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/style.css');
  res.sendFile(__dirname + '/img/*');
  res.sendFile(__dirname + '/js/*');
});
  
/*
io.on('connection', (socket) => {



  socket.on('connected', (msg) => {
    io.emit('uOnline',utenti)
    utentiOnlineConta++;
    console.log("Un client ha stabilito una nuova connessione!")
    utenti.push(msg)
    var res = `${msg} si è connesso alla chat`
    io.emit('response', res);
  })



  socket.on('dUser', (msg) =>{
    console.log("Un client ha interrotto la connessione!")
    utenti.pop(msg);
    io.emit('uOnline',utenti)
  });
  
  socket.on('user online',(msg)=>{
    console.log("Client " + msg+": Requested the online users list!")
    io.emit('uOnline',utenti)
  });

  socket.on('getUsersCount',()=>{
    io.emit('userCount',utentiOnlineConta)
  });
  socket.on('logout',(msg)=> {
    console.log("Un client ha interrotto la connessione!")
    for(i = 0;i<utentiOnlineConta;i++){
      if(utenti[i] == msg){
        utenti.pop(i);
        utentiOnlineConta--;
        break;
      }
    }
    io.emit("disconnect-response",msg)
  });


  socket.on('message', (msg) => {
    var messaggio = msg[1] + ": " + msg[0]
    io.emit('chat message', messaggio);
  });
});
  */


io.on('connection', socket => {
  socket.on('connected',(msg) =>{
    utenti.push(msg[0]);
    var connectionRoom = msg[1];
    console.log("New User:")
    console.log(utenti[utenti.length-1])
    socket.emit('rooms',room)
    socket.join(connectionRoom)
  });
  socket.on('message', (msg)=>{
    var message = msg[0].name+": "+msg[1]
    socket.emit('chat message',message)
  });

});



server.listen(3000, () => {
  console.log('listening on *:3000');
});

class Utente {
    constructor(name = "", UUID = "") {
        this.name = name;
        this.UUID = UUID;
        this.socketID = socket.id;
    }
}