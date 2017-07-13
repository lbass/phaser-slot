function SlotBar(props) {
  this._barPositionX = CONFIG.getConfig('BAR_POSITION_X');
  this._barPositionY = CONFIG.getConfig('BAR_POSITION_Y');
  this._imageSizeX = CONFIG.getConfig('IMAGE_SIZE_X');
  this._imageSizeY = CONFIG.getConfig('IMAGE_SIZE_Y');

  this.isActive = false;
  this.game = props.game;
  this.dragBarHandler = props.dragBarHandler;

  var bar = this.game.add.sprite(this._barPositionX, this._barPositionY, 'bar');
  this.stickUpImage = game.add.sprite(this._barPositionX + 62, this._barPositionY + 90, 'stick-up');
  this.stickDownImage = game.add.sprite(this._barPositionX + 62, this._barPositionY + 180, 'stick-down');
  this.stickDownImage.visible = false;

  this.barball = this.game.add.sprite(this._barPositionX + 31, this._barPositionY, 'barball');
  this.barball.inputEnabled = true;
  this.barball.anchor.set(0);
  this.barball.input.enableDrag(false, true, false, 0, null, bar);
  this.barball.input.allowHorizontalDrag = false;
  this.barball.events.onDragStart.add(this.onDragStart, this);
  this.barball.events.onDragStop.add(this.onDragStop, this);
  this.barball.events.onDragUpdate.add(this.onDragUpdate, this);
  this.barball.input.boundsRect = this.game.bounds;

  this.barball.events.onInputOver.add(function(){
    this.game.canvas.style.cursor = "pointer";
  }, this);
  this.barball.events.onInputOut.add(function(){
    this.game.canvas.style.cursor = "default";
  }, this);
}

SlotBar.prototype = {
  update: function() {
    if(this.isActive) {
      //  볼의 위치에 따라 스틱의 이미지를 교체한다.
      if(this.barball.y > this._barPositionY + 70) {
        this.stickUpImage.visible = false;
      } else {
        this.stickUpImage.visible = true;
      }

      if(this.barball.y > this._barPositionY + 200) {
        this.stickDownImage.visible = true;
      } else {
        this.stickDownImage.visible = false;
      }
    }
  },

  setDragEnable: function(flag) {
    this.barball.input.draggable = flag;
  },

  onDragStart: function(){
    this.isActive = true;
  },

  onDragUpdate: function(me, point, x, y) {
  },

  onDragStop: function(){
    var tween = game.add.tween(this.barball).to( {x: this._barPositionX + 31, y: this._barPositionY }, 1000, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function() { this.isActive = false; }, this);
    this.dragBarHandler();
  }
}
