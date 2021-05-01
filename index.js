const express = require("express")
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var utenti=[];
const room = ["MainChat"];
var utentiOnlineConta = utenti.length;

app.use(express.static(__dirname + '/public'));
app.get('/public', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/style.css');
  res.sendFile(__dirname + '/img/*');
  res.sendFile(__dirname + '/js/*');
});
  
io.on('connection', socket => {
  var connectionRoom;
  socket.on('connected',(msg) =>{
    utenti.push(msg[0]);
    connectionRoom = msg[1];
    console.log("New User:")
    console.log(utenti[utenti.length-1])
    socket.emit('rooms',room)
    socket.join(connectionRoom)
    console.log(socket.rooms)
  });

  socket.on('message', (msg)=>{
    var message = msg[0].name+": "+msg[2]
    socket.to(connectionRoom).emit('chat message',message)
  });

  socket.on('getUsers',()=>{
    socket.emit('response-Users', utenti)
  })

  socket.on('leaveing', (msg) => {
    console.log(msg.room)
    var i = 0;
    var trovato = false;
    utenti.forEach(utente => {
      console.log(utente != msg)
      if(utente.name == msg.name) {
        trovato = true;
      }
      if(!trovato){
        i++;
      }
    });
    console.log(i)
    utenti.splice(i,1);
    socket.broadcast.emit('chatEvent', `${msg.name} has left!`);
  });
});

    
function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}



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