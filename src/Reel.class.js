function Reel(props) {
  this._imagePositionX = CONFIG.getConfig('IMAGE_POSITION_X');
  this._imageSizeX = CONFIG.getConfig('IMAGE_SIZE_X');
  this._imageSizeY = CONFIG.getConfig('IMAGE_SIZE_Y');
  this._slotPositionY = CONFIG.getConfig('REEL_POSITION_Y');
  this._firstReelSpeed = 90;
  this._secondReelSpeed = 150;
  this._thirdReelSpeed = 200;

  this.selectedImages = {};
  this.isComplete = false;

  this.game = props.game;
  items = props.items;

  //  first reel.
  this.reel1 = this.game.add.group();
  this.reel2 = this.game.add.group();
  this.reel3 = this.game.add.group();

  //  reel의 Image 생성
  this._createSlotImage(this._imagePositionX, items, this.reel1);
  this._createSlotImage(this._imagePositionX + this._imageSizeX, items, this.reel2);
  this._createSlotImage(this._imagePositionX + (this._imageSizeX * 2), items, this.reel3);
  this.reel1.changeable = true;
  this.reel2.changeable = true;
  this.reel3.changeable = true;

  this.blurX = game.add.filter('BlurX');
  this.blurY = game.add.filter('BlurY');
  this.reel1.filters = [this.blurX, this.blurY];
  this.reel2.filters = [this.blurX, this.blurY];
  this.reel3.filters = [this.blurX, this.blurY];
  this.blurX.blur = 0;
  this.blurY.blur = 0;

  this._initSlot();

}

Reel.prototype = {
  update: function() {
    if(this.isSpinning) {
      this._updateReel(this.reel1);
      this._updateReel(this.reel2);
      this._updateReel(this.reel3);
    }
  },

  startSpinning: function() {
    this._initSlot();
    this.isComplete = false;
    this.isSpinning = true;
    this.blurY.blur = 40;
  },

  stopSpinning: function() {
    this.blurY.blur = 0;
    this._slowReels();
  },

  getIsCompleteOnce: function() {
    var result = this.isComplete;
    this.isComplete = false;
    return result;
  },

  getSelected: function() {
    return this.selectedImages;
  },

  _updateReel: function(reel) {
    if(reel.changeable) {
      reel.changeable = false;
      var speed = reel.speed;
      var images = reel.children;
      var overImageInx = -1;

      for(var i = 0 ; i < images.length ; i++) {
        var image = images[i];
        image.y = image.y - speed;
        if(image.y <= -500) {
          overImageInx = i;
        }
      }

      if(overImageInx !== -1) {
        var idx = overImageInx - 1;
        if(overImageInx === 0) {
          idx = images.length - 1;
        }
        images[overImageInx].y = images[idx].y + image.height;
      }
      reel.changeable = true;
    }
  },

  _slowReels: function(){
    this.blurY.blur = 0;
    var me = this;
    var selectedImages = {
      'first': null,
      'second': null,
      'third': null,
    };

    var reel1stop = false;
    var reel2stop = false;
    var reel3stop = false;
    var slowReels = setInterval(function(){
      //  속도가 20이하로 느려지면 정확한 위치에 놓는다.
      if(me.reel1.speed <= 20) {
        reel1stop = true;
        me.reel1.speed = 0;
        if(!selectedImages.first) {
          selectedImages.first = me._getSelectedImage(me.reel1);
        }
      } else {
        me.reel1.speed -= 7;
      }

     if(me.reel2.speed <= 20) {
       reel2stop = true;
       me.reel2.speed = 0;
       if(!selectedImages.second) {
         selectedImages.second = me._getSelectedImage(me.reel2);
       }
     } else {
       me.reel2.speed -= 7
     }

     if(me.reel3.speed <= 20) {
       me.reel3.speed = 0;
       if(!selectedImages.third) {
         selectedImages.third = me._getSelectedImage(me.reel3, function(){
           reel3stop = true;
         });
       }
     } else {
       me.reel3.speed -= 7
     }

     if(reel1stop && reel2stop && reel3stop ) {
       clearInterval(slowReels);
       me.selectedImages = selectedImages;
       me.isSpinning = false;
       me.isComplete = true;
     }
   }, 100);
  },

  _initSlot: function() {
    //  슬롯 초기화
    this.reel1.speed = this._firstReelSpeed;
    this.reel2.speed = this._secondReelSpeed;
    this.reel3.speed = this._thirdReelSpeed;
    // align the reels vertically to their spots

    this.selectedImages = {};

    this.reel1.changeable = true;
    this.reel2.changeable = true;
    this.reel3.changeable = true;

    this.reel1.y = this._slotPositionY;
    this.reel2.y = this._slotPositionY;
    this.reel3.y = this._slotPositionY;
  },

  _shuffleRandom: function(n) {
    var returnArr = new Array();
    var temp;

    for(var i = 0 ; i < n ; i++){
      returnArr.push(i);
    }
    var randomN;
    for(var i = 0; i < returnArr.length ; i++) {
      randomN = Math.floor(Math.random() * n);
      temp = returnArr[i];
      returnArr[i] = returnArr[randomN];
      returnArr[randomN] = temp;
    }
    return returnArr;
  },

  _createSlotImage: function(x, items, reel) {
    var itemLength = items.length;
    var shuffleRandomArr = this._shuffleRandom(itemLength);
    for(var i = 0 ; i < itemLength ; i++){
      var name = items[shuffleRandomArr[i]];
      var slot = reel.create(x, (i * this._imageSizeY), name);
      slot.data = {'name': name};
    }
  },

  _getSelectedImage: function(reel, tweenOnComplete) {
    var moveY = 2000;
    var selectedIndex = 0;
    var reelImages = reel.children
    for(var i = 0 ; i < reelImages.length ; i++) {
      var imageY = reelImages[i].y;
      if(imageY > 0 && moveY > imageY) {
        moveY = imageY;
        selectedIndex = i;
      } else if(imageY === 0) {
        moveY = 0;
        break;
      }
    }
    var tween = this.game.add.tween(reel).to( { y: [reel.y - (this._imageSizeY + moveY)] }, 1000);
    tween.interpolation(function(v, k){
      return Phaser.Math.bezierInterpolation(v, k);
    });
    if(tweenOnComplete) {
      tween.onComplete.add(tweenOnComplete, this);
    }
    tween.start();

    //최종적으로 선택된 이미지
    if(selectedIndex === reelImages.length - 1) {
      selectedIndex = 0;
    } else {
      selectedIndex++;
    }
    return reelImages[selectedIndex].data.name;
  }
}
