var express = require('express');
var app = express();
var serv = require('http').createServer(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use('/public', express.static(__dirname + '/public'));
console.log("Server started.");

var srv = app.listen(2000, function () {
        var host = srv.address().address;
        var port = srv.address().port;
});

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function (id) {
    var self = {
        x: 250,
        y: 250,
        id: id,
        width: 50,
        height: 50,
        number: "" + Math.floor(10 * Math.random()),
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        maxSpd: 5,
    };
    self.updatePosition = function () {
        if (self.pressingRight)
            self.x += self.maxSpd;
        if (self.pressingLeft)
            self.x -= self.maxSpd;
        if (self.pressingUp)
            self.y -= self.maxSpd;
        if (self.pressingDown)
            self.y += self.maxSpd;
    };
    return self;
};

var io = require('socket.io')(serv, {});
io.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    socket.on('keyPress', function (data) {
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp = data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
    });

    socket.on('tchat', function (msg) {
        io.emit('tchat', msg);
    });
});

setInterval(function () {
    var pack = [];
    for (var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            number: player.number
        });
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }


}, 1000 / 60);
