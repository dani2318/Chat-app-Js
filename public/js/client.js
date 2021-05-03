var socket = io();
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var online = document.getElementById("Users")
//var username = document.getElementById("Username");
var nickname = "";
var username = customUsername();

var rooms = [];
class Utente {
    constructor(name = "", UUID = "", room = "") {
        this.name = name;
        this.UUID = UUID;
        this.room = room;
    }
}

const CLIENT_UUID = uuidv4();

function uuidv4() {
    return 'xxxx4xxxyxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function customUsername() {
    return 'User-4yxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


//Network Code!

//Gestione prima connessione
var profile = new Utente(username, CLIENT_UUID, "MainChat",)//[username,CLIENT_UUID]
var data = [profile, "MainChat"]
socket.on("connection", socket.emit("connected", data));

//Messaggi input
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value == "") return;
    if (input.value) {
        socket.emit("message", [profile, "MainChat", input.value]);

        var item = document.createElement("li");
        var sender = profile.name;
        var message = input.value;

        var s = sender + ": ";
        var bold = document.createElement("b")
        bold.style.color = "green"
        bold.innerHTML = s;
        item.appendChild(bold)
        item.innerHTML = item.innerHTML + message;
        messages.appendChild(item);
        window.scrollTo(0, messages.scrollHeight);
        input.value = "";
    }
});

//Messaggi output
socket.on("chat message", function (msg) {
    var item = document.createElement("li");
    var elementiMessaggio = msg.split(":")
    var sender = elementiMessaggio[0];
    var message = elementiMessaggio[1];

    var s = sender + ": ";
    var bold = document.createElement("b")
    bold.style.color = "red"
    bold.innerHTML = s;
    item.appendChild(bold)
    item.innerHTML = item.innerHTML + message;
    messages.appendChild(item);
    window.scrollTo(0, messages.scrollHeight);
});

socket.on("chatEvent",(msg) => {
    var item = document.createElement("li")
    item.textContent = msg
    messages.appendChild(item);
});



//Ricevo la lista delle stanze disponibili 
socket.on('rooms', (msg) => {
    rooms = msg
});

//Aggiornamento lista utenti
socket.emit("getUsers")
setInterval('socket.emit("getUsers")', 1000)

socket.on('response-Users', (msg) => {
    updateUserlist(msg)
})

function updateUserlist(msg){
    while (online.firstChild) {
        online.removeChild(online.firstChild);
    }
    msg.forEach(element => {
        var item = document.createElement("li")
        item.textContent = element.name
        online.appendChild(item);
    });
}

//Disconnessione utente

function logout(){
    socket.emit('leaveing',profile)
    socket.disconnect();
}