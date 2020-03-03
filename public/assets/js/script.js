let game = document.getElementById("game").getContext("2d");

let socket = io();
socket.on('newPositions', function (data) {
    game.clearRect(0, 0, 500, 500);
    for (let i = 0; i < data.length; i++) {
        let img = new Image();
        img.src = '/public/assets/images/perso.png';
        game.drawImage(img, data[i].x, data[i].y, data[i].width, data[i].height)
    }
});

keys = {
    "left": "KeyA",
    "right": "KeyD",
    "up": "KeyW",
    "back": "KeyS"
};

document.onkeydown = function (event) {
    switch (event.code) {
        case keys['right']:
            socket.emit('keyPress', {inputId: 'right', state: true});
            break;
        case keys['back']:
            socket.emit('keyPress', {inputId: 'down', state: true});
            break;
        case keys['left']:
            socket.emit('keyPress', {inputId: 'left', state: true});
            break;
        case keys['up']:
            socket.emit('keyPress', {inputId: 'up', state: true});
            break;
    }
};

document.onkeyup = function (event) {
    switch (event.code) {
        case keys['right']:
            socket.emit('keyPress', {inputId: 'right', state: false});
            break;
        case keys['back']:
            socket.emit('keyPress', {inputId: 'down', state: false});
            break;
        case keys['left']:
            socket.emit('keyPress', {inputId: 'left', state: false});
            break;
        case keys['up']:
            socket.emit('keyPress', {inputId: 'up', state: false});
            break;
    }
};

$(function () {
    var socket = io();
    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('tchat', $('#message').val());
        $('#message').val('');
        return false;
    });
    socket.on('tchat', function (msg) {
        $('#messages').prepend($('<li>').text(msg));
    });
});