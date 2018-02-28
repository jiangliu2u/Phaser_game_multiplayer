var RemotePlayer = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY
  this.game = game
  this.player = player;
  this.alive = true;
  this.player = game.add.sprite(x, y, 'ship');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.name = index.toString();
  game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.collideWorldBounds = true;
  this.lastPosition = { x: x, y: y };
}

RemotePlayer.prototype.update = function () {
  if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y || this.player.angle != this.lastPosition.angle) {
    this.lastPosition.x, this.lastPosition.y)
  } else {
  }

  this.lastPosition.x = this.player.x
  this.lastPosition.y = this.player.y
  this.lastPosition.angle = this.player.angle
}

window.RemotePlayer = RemotePlayer
