var socket = io.connect();
socket.on('connect', function () {
    console.log('connected to server!');
    socket.emit('happy', {reason: '哈哈哈'});

});
socket.on('new_player', function (data) {
    console.log(data.id);
    console.log(data.x);
    console.log(data.y);
});
var position = {
    x:Math.random()*100+300,
    y:Math.random()*200+200,
};
var weapon;
var player;
var cursors;
var fireButton;
function createPlayer(x,y) {//新建本地玩家
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    client_player=new Player(x,y);
    player=game.add.sprite(x,y,'ship');
    weapon = game.add.weapon(30, 'bullet');

    //  The bullets will be automatically killed when they are 2000ms old
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 2000;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 100;
    game.physics.enable(player, Phaser.Physics.ARCADE);
   // client_player.id=this.id;
   // console.log('socket.id========>  '+this.id);
    weapon.trackSprite(player, 0, 0, true);
    socket.emit('new_player',client_player);
}

var remote_player = function (id,x,y) {
    this.x=x;
    this.y=y;
    this.id=id;
    this.player=game.add.sprite(x,y,'ship');
}

game = new Phaser.Game(800, 600, Phaser.CANVAS, '');
main = function (game) {

};
other_players=[]
main.prototype = {
    preload: function () {
        game.load.image('bullet','/client/assets/bullet.png');
        game.load.image('ship','/client/assets/ship.png');
    },
    create: function () {
        socket.on('connect',createPlayer(position.x,position.y));

        socket.on('new_other_player',function (data) {//新加入的玩家
            game.add.sprite(data.x,data.y,'ship');
        });
        socket.on('ConnectedPlayer',function (data) {//已连接的玩家
            game.add.sprite(data.x,data.y,'ship');
        });
        socket.on('remove_player',onRemovePlayer);
    },
    update: function () {
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
        }
        if (fireButton.isDown)
        {
            weapon.fire();
        }
    }
};
game.state.add('Main',main);
game.state.start('Main');
