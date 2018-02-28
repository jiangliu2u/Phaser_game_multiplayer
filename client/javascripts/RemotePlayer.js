var RemotePlayer = function (index, game, startX, startY) {
  var x = startX;
  var y = startY;
  this.id=index;
  this.game = game;
  this.alive = true;
  this.player = game.add.sprite(x, y, 'ship');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.name = index.toString();
  game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.collideWorldBounds = true;
  this.lastPosition = { x: x, y: y };
};

RemotePlayer.prototype.update = function () {

  this.lastPosition.x = this.player.x;
  this.lastPosition.y = this.player.y;

};

window.RemotePlayer = RemotePlayer;
