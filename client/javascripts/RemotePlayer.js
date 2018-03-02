var RemotePlayer = function (index, game, startX, startY) {
  var x = startX;
  var y = startY;
  this.id=index;
  this.game = game;
  this.game.state.disableVisibilityChange = true;
  this.alive = true;
  this.player = game.add.sprite(x, y, 'ship');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.name = index.toString();
  game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.collideWorldBounds = true;
  this.weapon = game.add.weapon(20, 'bullet');
  this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
  this.weapon.bulletLifespan = 2000;
  this.weapon.bulletSpeed = 700;
  this.weapon.fireRate = 100;
  this.weapon.trackSprite(this.player, 0, 0, true);
  this.weapon.bulletInheritSpriteSpeed=true;
  //this.lastPosition = { x: x, y: y };
};

RemotePlayer.prototype.fire = function () {

    this.weapon.fire();

};

window.RemotePlayer = RemotePlayer;
