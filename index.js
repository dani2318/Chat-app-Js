const express = require("express")
const http = require('http')
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server);

var utenti=[];
const room = ["MainChat"];

app.use(express.static(__dirname + '/public'));
app.get('/public', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/logout.html');
  res.sendFile(__dirname + '/style.css');
  res.sendFile(__dirname + '/img/*');
  res.sendFile(__dirname + '/js/*');
  res.sendfile(__dirname + '/css/*')
});
  
io.on('connection', socket => {
  var connectionRoom;
  socket.on('connected',(msg) =>{
    utenti.push(msg[0]);
    console.clear()
    console.log(`Utenti Online: ${utenti.length}`)
    connectionRoom = msg[1];
    console.log("New User:")
    console.log(utenti[utenti.length-1])
    socket.emit('rooms',room)
    socket.join(connectionRoom)
  });

  socket.on('message', (msg)=>{
    var message = msg[0].name+": "+msg[2]
    socket.to(connectionRoom).emit('chat message',message)
  });

  socket.on('getUsers',()=>{
    socket.emit('response-Users', utenti)
  })

  socket.on('leaveing', (msg) => {
    var i = 0;
    var trovato = false;
    utenti.forEach(utente => {
      if(utente.name == msg.name) {
        trovato = true;
      }
      if(!trovato){
        i++;
      }
    });
    if(trovato){
      utenti.splice(i,1);
    }
    console.log(`Utenti Online: ${utenti.length}`)
    socket.broadcast.emit('chatEvent', `${msg.name} has left!`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

class Utente {
  constructor(name = "", UUID = "", room = "") {
      this.name = name;
      this.UUID = UUID;
      this.room = room;
  }
}