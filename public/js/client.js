var socket = io();
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var online = document.getElementById("Users")
//var username = document.getElementById("Username");
var nickname = "";
var username = customUsername();

const CLIENT_UUID = uuidv4();

socket.on("connection", socket.emit("connected", username));

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        var msg = [input.value, username];
        socket.emit("message", msg);
        input.value = "";
    }
});

socket.on("user connected", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg[0];
    nickname = msg[1];
    username.value = nickname;
    messages.appendChild(item);
    window.scrollTo(0, messages.scrollHeight);
});

socket.on("chat message", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, messages.scrollHeight);
});

socket.on("response", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, messages.scrollHeight);
});

socket.on("disconnect-response",(msg)=>{
    if(username == msg) console.log("Disconnesso")
})

function logout(){
    socket.emit('logout',username)
}
var usrOnline = 0;
socket.emit('getUsersCount')
socket.on('userCount', (msg) => {
    console.log(msg)
    if (msg == undefined || msg == null) console.log('Errore nel ricevere gli utenti connessi')
    usrOnline = msg
});

socket.on("uOnline", function (msg) {
    console.log("Utenti online:" + msg)
    console.log("Update Online Users")
    console.log(usrOnline)
    clearUser();
    for(i = 0;i<usrOnline;i++){
        var item = document.createElement("li");
        item.textContent = msg[i];
        online.appendChild(item);
        window.scrollTo(0, online.scrollHeight);
    }
    /*msg.forEach(element => {
        clearUser();
        var item = document.createElement("li");
        item.textContent = element;
        online.appendChild(item);
        window.scrollTo(0, online.scrollHeight);
    });*/
});


function clearUser() {
    online.childNodes.forEach(element => {
        online.removeChild(element);
    });
}
setInterval(`requestOnlineUsers()`, 5000)

function requestOnlineUsers() {
    socket.emit('user online', CLIENT_UUID)
}

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

