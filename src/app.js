'use strict';
var reel = {};
var coinGroup = {};
var slotBar = {};
var successLine = {};
var reg = {};
var quake = {};
var talk = {};
var modal = {};
var itemText = {};

var slotBody = {};
var money = {};
var headerCoin = {};
var credit = {};
var bodyGroup = {};
var coinTunnel = {};

var gameWidthX = CONFIG.getConfig('GAME_WIDTH');
var gameHeightX = CONFIG.getConfig('GAME_HEIGHT');

var playCount = CONFIG.getConfig('TOTAL_PLAY_COUNT');
var coinTunnelY = CONFIG.getConfig('COIN_TUNNEL_Y');
var reelPositionY = CONFIG.getConfig('REEL_POSITION_Y');

var coinGroupPositionX =  CONFIG.getConfig('COIN_GROUP_POSITION_X');
var reelFirstPostionX = CONFIG.getConfig('IMAGE_POSITION_X');

var headerPositionY = CONFIG.getConfig('HEADER_POSITION_X');
var headerPositionX = CONFIG.getConfig('HEADER_POSITION_Y');
var talkPositionX = CONFIG.getConfig('TALK_POSITION_X');
var talkPositionY = CONFIG.getConfig('TALK_POSITION_Y');

var soundOnOffButtonX = CONFIG.getConfig('SOUND_ONOFF_BUTTON_X');
var soundOnOffButtonY = CONFIG.getConfig('SOUND_ONOFF_BUTTON_Y');
var closeButtonX = CONFIG.getConfig('CLOSE_BUTTON_X');
var closeButtonY = CONFIG.getConfig('CLOSE_BUTTON_Y');

var isGameover = false;
var isGetProduct = false;

var game = new Phaser.Game(gameWidthX, gameHeightX, Phaser.CANVAS, '',
{
  preload: preload,
  create: create,
  update: update
}, false, false);

function preload() {
  game.load.image('background', 'assets/bg_select.png');
  game.load.image('slot-body', 'assets/SLOT_EMPTY_bg.png');
  //game.load.image('background', 'assets/bg.png');
  game.load.image('credit', 'assets/credit.png');
  game.load.image('money-15', 'assets/15000.png');
  game.load.image('money-10', 'assets/10000.png');
  game.load.image('money-5', 'assets/5000.png');
  game.load.image('money-0', 'assets/0.png');

  game.load.image('close-button', 'assets/close.png');
  game.load.image('sound-button-enable', 'assets/v_on.png');
  game.load.image('sound-button-disable', 'assets/v_off.png');

  game.load.image('poker', 'assets/item0.jpg');
  game.load.image('heart', 'assets/item1.jpg');
  game.load.image('king', 'assets/item2.jpg');
  game.load.image('seven', 'assets/item3.jpg');
  game.load.image('queen', 'assets/item4.jpg');
  game.load.image('success-line', 'assets/line.png');
  game.load.image('talk', 'assets/talk.png');
  game.load.image('item_text_1', 'assets/item1_text.png');
  game.load.image('item_text_2', 'assets/item2_text.png');
  game.load.image('item_text_3', 'assets/item3_text.png');
  game.load.image('item_text_4', 'assets/item4_text.png');

  game.load.image('rays', 'assets/rays.png');
  game.load.image('gameover-modal', 'assets/modal.png');
  game.load.image('modal_coin', 'assets/modal_coin.png');
  game.load.image('poker_modal', 'assets/item0_modal.png');
  game.load.image('heart_modal', 'assets/item1_modal.png');
  game.load.image('king_modal', 'assets/item2_modal.png');
  game.load.image('seven_modal', 'assets/item3_modal.png');
  game.load.image('queen_modal', 'assets/item4_modal.png');

  game.load.image('coin-tunnel', 'assets/coin_tunnel.png');
  game.load.image('coin', 'assets/small_coin.png');

  game.load.image('bar', 'assets/bar.png');
  game.load.image('barball', 'assets/barball.png');
  game.load.image('stick-up', 'assets/barstick_t.png');
  game.load.image('stick-down', 'assets/barstick_b.png');

  game.load.script('BlurX', 'src/BlurX.js');
  game.load.script('BlurY', 'src/BlurY.js');

  game.load.spritesheet('header-coin', 'assets/coin_ani.gif', 32, 31, 5);

  game.load.audio('speen-reel', 'assets/audio/scroll.mp3');
  game.load.audio('show-popup', 'assets/audio/ddadan.mp3');
}

function create() {
  var margin = 50;
  var x = -margin;
  var y = -margin;
  var w = game.world.width + margin * 2;
  var h = game.world.height + margin * 2;
  game.world.setBounds(x, y, w, h);
  game.physics.setBoundsToWorld();
  //  Game에서 커서가 떠나도 게임이 정지하지 않는다.
  game.stage.disableVisibilityChange = true;

  var items = CONFIG.getConfig('ITEMS');

  reel = new Reel({
    'game': game,
    'items': items
  });
  game.add.sprite(0, 0, 'background');

  bodyGroup = game.add.group();

  slotBody = game.add.sprite(0, 0, 'slot-body');
  bodyGroup.add(slotBody);
  credit = game.add.sprite(headerPositionX + 190, headerPositionY, 'credit');
  credit.anchor.set(0.5, 0.5);
  bodyGroup.add(credit);
  money = game.add.sprite(headerPositionX, headerPositionY, 'money-' + (playCount * 5).toString());
  money.anchor.set(0.5, 0.5);
  bodyGroup.add(money);
  headerCoin = game.add.sprite(headerPositionX + 102, headerPositionY, 'header-coin');
  headerCoin.anchor.set(0.5, 0.5);
  bodyGroup.add(headerCoin);

  itemText = new ItemText({ game: game });
  coinTunnel = game.add.sprite(0, coinTunnelY, 'coin-tunnel');
  //mummy.scale.set(4);
  var anim = headerCoin.animations.add('walk');
  anim.play(5, true);

  coinGroup = game.add.group();
  coinGroup.enableBody = true;
  coinGroup.physicsBodyType = Phaser.Physics.ARCADE;

  slotBar = new SlotBar({
    'game': game,
    'dragBarHandler': spinReels
  });

  game.world.camera.position.set(0);

  successLine = game.add.sprite(reelFirstPostionX + 15, reelPositionY + 113, 'success-line');
  successLine.alpha = 0;

  modal = new Modal({game: game});

  talk = game.add.sprite(talkPositionX, talkPositionY, 'talk');

  var tween = game.add.tween(talk).to( { y:  talk.y - 10 }, 300, Phaser.Easing.Linear.None, false, 0, -1, true);
  tween.interpolation(function(v, k){
    return Phaser.Math.bezierInterpolation(v, k);
  });
  tween.start();

  game.sound.mute = true;
  fsn.components.SoundOnOffButton({
      game: game,
      x: soundOnOffButtonX,
      y: soundOnOffButtonY,
      imageName: 'sound-button-disable'
  });

  game.time.events.add(Phaser.Timer.SECOND * 5, showCloseButton, this);

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
}

function createCoins() {
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 7; x++) {
      var coin = coinGroup.create(coinGroupPositionX + x * 77, coinTunnelY + 62, 'coin');
      coin.alpha = 0;
      coin.name = 'alien' + x.toString() + y.toString();
      coin.checkWorldBounds = true;
      coin.events.onOutOfBounds.add(
        function (coin) {
          coin.alpha = 0;
          coin.reset(coin.x, coinTunnelY + 62);
          game.add.tween(coin).to( { alpha: 1 }, 800, Phaser.Easing.Linear.None, true, 0, 0);
          coin.body.velocity.y = 100 + Math.random() * 100;
        }, this);
      coin.body.velocity.y = 100 + Math.random() * 100;
      game.add.tween(coin).to( { alpha: 1 }, 800, Phaser.Easing.Linear.None, true, 0, 0);
    }
  }
}

function showCloseButton() {
  fsn.components.GameCloseButton({
      game: game,
      x: closeButtonX,
      y: closeButtonY,
      imageName: 'close-button'
  });
}

function update(){
  slotBar.update();
  reel.update();
  modal.update();

  //  결과를 한번만 가져온다.(연속적인 실행을 막기 위해)
  if(reel.getIsCompleteOnce()) {
    playCount--;
    slotBar.setDragEnable(true);
    var selectedImages = reel.getSelected();
    var isGetProduct = checkSlotPoint(selectedImages);

    //  당첨 되었을 경우
    if(isGetProduct) {
      this.game.time.events.add(Phaser.Timer.SECOND * 2.1, function(){
        playSound('show-popup');
        modal.showPresentModal(selectedImages.first);
        isGameover = true;
      }, this);
      slotBar.setDragEnable(false);
      return;
    }

    //  획득 상품도 없고 플레이 가능 횟수도 없을 경우 game over
    if(!isGetProduct && playCount <= 0) {
      this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
        modal.showGameOverModal();
      }, this);
      isGameover = true;
      slotBar.setDragEnable(false);
      return;
    }

    //대기 상태일 경우
    showSpritesForWaiting();
  }
}

function spinReels() {
  successLine.alpha = 0;

  hideSpritesForPlaying();

  money.loadTexture('money-' + ((playCount - 1) * 5).toString() , 0);
  playSound('speen-reel');

  addQuake();
  game.time.events.add(Phaser.Timer.SECOND * 0.6, function(){
    reel.stopSpinning();
  }, this);
  reel.startSpinning();
  slotBar.setDragEnable(false);
}

function checkSlotPoint(selectedImages) {
  var result = false;
  var firstName = selectedImages.first;
  var secondName = selectedImages.second;
  var thirdName = selectedImages.third;
  if(firstName === secondName && firstName === thirdName) {
    var tween = game.add.tween(successLine).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, false, 100, 4, false);
    tween.start();
    createCoins();
    result = true;
  }
  return result;
}

function showSpritesForWaiting() {
  talk.alpha = 1.0;
  itemText.show();
}

function hideSpritesForPlaying() {
  talk.alpha = 0.0;
  itemText.hide();
  coinGroup.killAll();
}

function addQuake() {
  var duration = 100;
  var ease = Phaser.Easing.Bounce.InOut;
  var autoStart = true;
  var delay = 0;
  var yoyo = true;
  var repeat = 12;

  quake = game.add.tween(bodyGroup).to({x: bodyGroup.x - 10}, duration, ease, autoStart, delay, repeat, yoyo);
}

function playSound(resouceName) {
    game.sound.play(resouceName);
}
