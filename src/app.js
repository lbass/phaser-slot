'use strict';
var game = new Phaser.Game(720, 1230, Phaser.CANVAS, '',
{
  preload: preload,
  create: create,
  update: update
}, false, false);

var reel = {};
var coinGroup = {};
var slotBar = {};
var successLine = {};
var reg = {};
var quake = {};
var money = {};

var playCount = CONFIG.getConfig('TOTAL_PLAY_COUNT');
var coinTunnelX = CONFIG.getConfig('COIN_TUNNEL_X');
var coinTunnelY = CONFIG.getConfig('COIN_TUNNEL_Y');

var modal = {};

var isGameover = false;
var isGetProduct = false;

function preload() {
  game.load.image('background', 'assets/bg_1.png');
  game.load.image('credit', 'assets/credit.png');
  game.load.image('money-15', 'assets/15000.png');
  game.load.image('money-10', 'assets/10000.png');
  game.load.image('money-5', 'assets/5000.png');
  game.load.image('money-0', 'assets/0.png');

  game.load.image('close-button', 'assets/close.png');
  game.load.image('poker', 'assets/item0.jpg');
  game.load.image('heart', 'assets/item1.jpg');
  game.load.image('king', 'assets/item2.jpg');
  game.load.image('seven', 'assets/item3.jpg');
  game.load.image('queen', 'assets/item4.jpg');
  game.load.image('success-line', 'assets/line.png');

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
  var credit = game.add.sprite(625, 90, 'credit');
  credit.anchor.set(0.5, 0.5);
  money = game.add.sprite(435, 90, 'money-' + (playCount * 5).toString());
  money.anchor.set(0.5, 0.5);


  game.add.sprite(coinTunnelX, coinTunnelY, 'coin-tunnel');

  var headerCoin = game.add.sprite(537, 90, 'header-coin');
  headerCoin.anchor.set(0.5, 0.5);
  //mummy.scale.set(4);
  headerCoin.smoothed = false;
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

  successLine = game.add.sprite(70, 348, 'success-line');
  successLine.alpha = 0;

  modal = new Modal({game: game});

  game.time.events.add(Phaser.Timer.SECOND * 5, showCloseButton, this);

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
}

function createCoins() {
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 7; x++) {
      var coin = coinGroup.create(98 + x * 75, 950, 'coin');
      coin.alpha = 0;
      coin.name = 'alien' + x.toString() + y.toString();
      coin.body.velocity.y = 200 + Math.random() * 200;
      coin.checkWorldBounds = true;
      coin.events.onOutOfBounds.add(
        function (coin) {
          coin.alpha = 0;
          coin.reset(coin.x, 950);
          game.add.tween(coin).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0);
          coin.body.velocity.y = 100 + Math.random() * 200;
        }, this);
      coin.body.velocity.y = 100 + Math.random() * 200;
      game.add.tween(coin).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0);
    }
  }
}

function showCloseButton() {
  var closeButton = this.add.sprite(660, 80, 'close-button');
  closeButton.inputEnabled = true;
  closeButton.events.onInputOver.add(function(){
    this.game.canvas.style.cursor = "pointer";
  }, this);
  closeButton.events.onInputOut.add(function(){
    this.game.canvas.style.cursor = "default";
  }, this);

  closeButton.anchor.set(0.5, 0.5);
  closeButton.events.onInputDown.add(
    function(){
      game.destroy();
    }, this);
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
    if(isGetProduct) {
      //  모달 생성 할 때 닫기 콜백으로 종료 모달 띄우기 구문 추가
      this.game.time.events.add(Phaser.Timer.SECOND * 2.1, function(){
        modal.showPresentModal(selectedImages.first);
        isGameover = true;
      }, this);
      slotBar.setDragEnable(false);
    }

    //  획득 상품도 없고 플레이 가능 횟수도 없을 경우 game over
    if(!isGetProduct && playCount <= 0) {
      modal.showGameOverModal();
      isGameover = true;
      slotBar.setDragEnable(false);
    }
  }
}

function spinReels() {
  successLine.alpha = 0;
  coinGroup.killAll();

  money.loadTexture('money-' + ((playCount - 1)*5).toString() , 0);

  addQuake();
  game.time.events.add(Phaser.Timer.SECOND * 2, stopReels, this);
  reel.startSpinning();
  slotBar.setDragEnable(false);
}

function stopReels() {
  stopQuake();
  reel.stopSpinning();
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

function addQuake() {
  var rumbleOffset = 10;
  var properties = {
    x: game.camera.x - rumbleOffset
  };

  var duration = 100;
  var ease = Phaser.Easing.Bounce.InOut;
  var autoStart = false;
  var delay = 0;
  var yoyo = true;
  var repeat = -1;

  quake = game.add.tween(game.camera).to(properties, 100, ease, autoStart, delay, repeat, yoyo);
  quake.start();
}

function stopQuake() {
  quake.stop(true);
  var properties = {
    x: game.camera.x + 10
  };
  game.add.tween(game.camera).to(properties, 100, Phaser.Easing.Bounce.InOut, true);
}
