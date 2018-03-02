var socket;
var weapon;
var player;
var cursors;
var fireButton;
var position = {
    x: Math.random() * 100 + 300,
    y: Math.random() * 200 + 200,
    rotation:Math.random()+1
};
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '');
var main = function (game) {
};
var other_players = [];
main.prototype = {
    preload: function () {
        game.load.image('bullet', '/client/assets/bullet.png');
        game.load.image('ship', '/client/assets/ship.png');
        
    },
    create: function () {
        socket = io.connect();
        game.state.disableVisibilityChange = true;
        weapon = game.add.weapon(20, 'bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletLifespan = 2000;
        weapon.bulletSpeed = 700;
        weapon.fireRate = 100;
        player = game.add.sprite(position.x, position.y, 'ship');
        player.anchor.set(0.5);
        game.physics.arcade.enable(player);
        player.body.drag.set(130);//摩擦力..
        player.body.maxVelocity.set(200);
        player.body.collideWorldBounds = true;
        game.physics.enable(player, Phaser.Physics.ARCADE);
        weapon.trackSprite(player, 0, 0, true);
        weapon.bulletInheritSpriteSpeed=true;
        game.world.wrap(player, 16);
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        socketHandler();
    },
    update: function () {
        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation, 600, player.body.acceleration);
        }
        else {
            player.body.acceleration.set(0);
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }
        if (cursors.left.isDown) {
            player.body.angularVelocity = -300;
            console.log('player angle:'+player.angle);
            console.log('player rotation:'+player.rotation);
        }
        else if (cursors.right.isDown) {
            player.body.angularVelocity = 300;
        }
        else {
            player.body.angularVelocity = 0;
        }

        if (fireButton.isDown) {
            fire();
        }
        socket.emit('move player',{id:socket.id,x:player.x,y:player.y,rotation:player.rotation})
    }
};

function onSocketConnected() {
    console.log("Connected  to socket server");
    socket.emit('new player', {x: player.x, y: player.y,rotation:player.rotation});
}

function onSocketDisconnect() {
    console.log('Disconnected from socket server');
    //delete 
}

function onNewPlayer(data) {
    console.log('New player connected');
    var duplicate = FindPlayerById(data.id);
    console.log(data.id + '新玩家id');
    if (duplicate) {
        console.log('Duplicate Player');
        //return;
    } else {
        other_players.push(new RemotePlayer(data.id, game, data.x, data.y, data.rotation))
    }
    console.log(other_players+'onnewPlayer');
}

function displayOtherPlayer(data) {
    other_players.push(new RemotePlayer(data.id, game, data.x, data.y, data.rotation));
    console.log(other_players+'displayPlayer');
};


function socketHandler() {
    socket.on('connect', onSocketConnected);
    socket.on('disconnect', onSocketDisconnect);
    socket.on('new player', onNewPlayer);
    socket.on('ConnectedPlayer', displayOtherPlayer);//此前连接的玩家
    socket.on('move player', onPlayerMove);
    socket.on('player fire',onPlayerFire);

}
function onPlayerFire(data){
    var fire_player = FindPlayerById(data.id);
    fire_player.fire();
}
function onPlayerMove(data){
    var moved_player = FindPlayerById(data.id);
    moved_player.player.x=data.x;
    moved_player.player.y=data.y;
    moved_player.player.rotation=data.rotation;
    
}

function FindPlayerById(id) {
    for (var i = 0; i < other_players.length; i++) {
        if (other_players[i].id === id) {
            return other_players[i];
        }
    }

    return false;
}
function fire(){
    weapon.fire();
    socket.emit("fire",{id:socket.id});
}
game.state.add('Main', main);
game.state.start('Main');
