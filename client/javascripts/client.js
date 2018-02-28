var socket;
var weapon;
var player;
var cursors;
var fireButton;
var position = {
    x:Math.random()*100+300,
    y:Math.random()*200+200,
};

var remote_player = function (id,x,y) {
    this.id=id;
	this.x=x;
    this.y=y;
    this.player=game.add.sprite(x,y,'ship');
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '');
var main = function (game) {};
var other_players=[]
main.prototype = {
    preload: function () {
        game.load.image('bullet','/client/assets/bullet.png');
        game.load.image('ship','/client/assets/ship.png');
    },
    create: function () {
        socket = io.connect();
        
        weapon = game.add.weapon(30, 'bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletLifespan = 2000;
        weapon.bulletSpeed = 400;
        weapon.fireRate = 100;
        player=game.add.sprite(position.x,position.y,'ship');
        player.anchor.set(0.5);
        game.physics.arcade.enable(player);
        player.body.drag.set(100);//摩擦力..
        player.body.maxVelocity.set(200);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        weapon.trackSprite(player, 0, 0, true);
        game.world.wrap(player, 16);
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        socketHandler();
    },
    update: function () {
        if (cursors.up.isDown)
        {
            game.physics.arcade.accelerationFromRotation(player.rotation, 600, player.body.acceleration);
        }
        else
        {
            player.body.acceleration.set(0);
//            player.body.velocity.x=0;
//            player.body.velocity.y=0;
        }
        if (cursors.left.isDown)
        {
            player.body.angularVelocity = -300;
        }
        else if (cursors.right.isDown)
        {
            player.body.angularVelocity = 300;
        }
        else
        {
            player.body.angularVelocity = 0;
        }

        if (fireButton.isDown)
        {
            weapon.fire();
        }
    }
};
function onSocketConnected(){
    console.log("Connected  to socket server");
    socket.emit('new player',{x:player.x,y:player.y});
}
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}
function onNewPlayer(data){
    console.log('New player connected');
    var duplicate = FindPlayerById(data.id);
    if(duplicate){
        console.log('Duolicate Player');
        return;
    }
    other_players.push(new RemotePlayer(data.id,game,player,data.x,data.y))
}
var socketHandler = function(){
    socket.on('connect',onSocketConnected);
    socket.on('disconnect',onSocketDisconnect);
    socket.on('new player',onNewPlayer);
    socket.on('player_move',onPlayerMove);
    
}
function FindPlayerById (id) {
  for (var i = 0; i < other_players.length; i++) {
    if (other_players[i].player.name === id) {
      return other_players[i]
    }
  }

  return false
}
game.state.add('Main',main);
game.state.start('Main');
