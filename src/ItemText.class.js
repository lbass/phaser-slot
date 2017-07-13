function ItemText(props) {
  var game = props.game;
  var textPositionX = CONFIG.getConfig('ITEM_TEXT_POSITION_X');
  var textPositionY = CONFIG.getConfig('COIN_TUNNEL_Y') + 83;

  var initPositionY = -50;
  this.itemCount = 4;
  this.items = new Array();
  for(var i = 0 ; i < this.itemCount ; i++) {
    var item = game.add.sprite(textPositionX, textPositionY + initPositionY, 'item_text_' + (i + 1).toString());
    initPositionY = initPositionY + 50;
    this.items.push(item);
  }

  game.time.events.loop(Phaser.Timer.SECOND * 3, function() {
    for(var i = 0 ; i < this.itemCount ; i++) {
      var item = this.items[i];
      var tween = game.add.tween(item).to( { y: item.y + 50 }, 1000, Phaser.Easing.Linear.None, true, 0);
      tween.onComplete.add(function() {
        if(this.y >= textPositionY + 150) {
          this.y = this.y - 200;
        }
      }, item);
    }
  }, this);
}

ItemText.prototype = {
  update: function() {
  },
  show: function() {
    for(var i = 0 ; i < this.itemCount ; i++) {
      this.items[i].alpha = 1.0;
    }
  },
  hide: function() {
    for(var i = 0 ; i < this.itemCount ; i++) {
      this.items[i].alpha = 0.0;
    }
  }
}
