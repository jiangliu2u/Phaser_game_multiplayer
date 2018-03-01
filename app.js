var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server, {});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');

});
app.use('/client/js', express.static(__dirname + '/client/javascripts'));
app.use('/client/assets', express.static(__dirname + '/client/assets'));
app.use('/client', express.static(__dirname + '/client'));
server.listen(2000);
var lastid = 0;
var position = {
    x: Math.random() * 100 + 300,
    y: Math.random() * 200 + 200,
};
var Player = function (x, y, rotation) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
};
var PL_LS = [];
var SOCKET_LS = {}
io.sockets.on('connection', function (socket) {
    console.log('新用户已连接');
    socket.on('new player', onNewPlayer);
    socket.on('disconnect', onClientDisconnect);
    socket.on('move player',onPlayerMove);

});

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y, data.rotation);
    newPlayer.id = this.id;
    console.log(PL_LS);
    console.log('hahahahah======> ' + this.id);
    var current_player_info = {
        id: newPlayer.id,
        x: newPlayer.x,
        y: newPlayer.y,
        rotation:newPlayer.rotation
    };
    for (var i = 0; i < PL_LS.length; i++) {
        connected_player = PL_LS[i];
        var p_info = {
                id: connected_player.id,
                x: connected_player.x,
                y: connected_player.y,
                rotation:connected_player.rotation
            };
        //向新玩家发送已连接的玩家信息
        this.emit('ConnectedPlayer', p_info);//

    }
    //向其他此前连接客户端发送新玩家的信息
    this.broadcast.emit('new player', current_player_info);
    PL_LS.push(newPlayer);
}

function onClientDisconnect() {
    console.log('disconnect');
    var removePlayer = find_playerid(this.id);
    if (removePlayer) {
        PL_LS.splice(PL_LS.indexOf(removePlayer), 1);
    }
    console.log("removing player " + this.id);
    //send message to every connected client except the sender
    this.broadcast.emit('remove_player', {id: this.id});
}

function onPlayerMove(data){
    var moveplayer = find_playerid(data.id);
    moveplayer.x=data.x;
    moveplayer.y=data.y;
    moveplayer.rotation=data.rotation;
    this.broadcast.emit('move player',moveplayer);
}
function find_playerid(id) {
    for (var i = 0; i < PL_LS.length; i++) {
        if (PL_LS[i].id == id) {
            return PL_LS[i];
        }
    }
    return false;
}