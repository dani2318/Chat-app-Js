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
    constructor(name = "", UUID = "") {
        this.name = name;
        this.UUID = UUID;
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
var profile = new Utente(username, CLIENT_UUID)//[username,CLIENT_UUID]
console.log(socket.id)
var data = [profile,"MainChat"]
socket.on("connection", socket.emit("connected", data));

//Messaggi input
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if(input.value == "") return;
    if (input.value) {
        console.log([profile, input.value])
        socket.emit("message", [profile, input.value]);
        input.value = "";
    }
});

//Messaggi output
socket.on("chat message", function (msg) {
    var item = document.createElement("li");
    var elementiMessaggio = msg.split(":")
    console.log(elementiMessaggio)
    var sender = elementiMessaggio[0];
    var message = elementiMessaggio[1];

    var s = sender+":";
    var bold = document.createElement("b")
    bold.style.color = "red"
    bold.innerHTML = s;
    item.appendChild(bold)
    item.innerHTML = item.innerHTML + message;
    //item.textContent = final;
    messages.appendChild(item);
    window.scrollTo(0, messages.scrollHeight);
});

socket.on('rooms',(msg)=>{
    rooms = msg
    console.log(rooms)
});