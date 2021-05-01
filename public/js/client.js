function load() {
    var socket = io();
    var online = document.getElementById("Users")
    var usernameIniz = prompt("Inserisci un username", "");
    socket.on("connection", socket.emit("connected", usernameIniz));
    console.log(usernameIniz)
    return usernameIniz;
}

var nickOnLoad = load();
var socket = io();
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var username = document.getElementById("Username");
var nickname = "";

username.innerHTML = nickOnLoad;
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (username.value == "" || username == null) {
        alert("Inserisci un nickname prima di inviare un messaggio!");
        return;
    }
    if (input.value) {
        var msg = [input.value, username.value];
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


setInterval('reqUser()', 1)


function reqUser() {
    var online = document.getElementById('Users')
    socket.emit('user online')
    socket.on("user online", function (msg) {
        for (i = 0; i < msg.lenght; i++) {
            var item = document.createElement("li");
            item.textContent = msg;
            online.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
}