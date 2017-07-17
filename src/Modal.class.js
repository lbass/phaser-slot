function Modal(props) {
  this.game = props.game;
  //this.modalName = props.modalName;
  this.modalName = '';

  this.isActivePresentModal = false;
  this.rays = {};
  this.mask = {};
  this.modal = {};
  this.modalCoin = {};

  this._modalPositionX = 80;
  this._modalPositionY = 230;

}

Modal.prototype = {
  update: function() {
    if(this.isActivePresentModal) {
      this.rays.angle++;
    }
  },

  showPresentModal: function(imageName) {
    this.isActivePresentModal = true;

    this.mask = game.add.graphics(0, 0);
    this.mask.beginFill(0x000000);
    this.mask.drawRect(0, 0, 720, 1350);
    this.mask.alpha = 0.7;

    this.modal = game.add.sprite(this._modalPositionX, this._modalPositionY, imageName + '_modal');
    this.modal.inputEnabled = true;
    this.modal.events.onInputDown.add(function() {
      window.open('http://play.google.com/store/apps/details?id=com.nhnent.Qpoker&hl=ko');
      //this.hideModal();
    }, this);

    this.rays = game.add.sprite(this._modalPositionX + 295, this._modalPositionY + 230, 'rays');
    this.rays.anchor.setTo(0.5, 0.5);
    this.modalCoin = this.game.add.sprite(this._modalPositionX + 200, this._modalPositionY + 180, 'modal_coin');
  },
  showGameOverModal: function() {
    this.mask = game.add.graphics(0, 0);
    this.mask.beginFill(0x000000);
    this.mask.drawRect(0, 0, 720, 1350);
    this.mask.alpha = 0.7;

    this.modal = game.add.sprite(this._modalPositionX, this._modalPositionY + 200, 'gameover-modal');
    this.modal.inputEnabled = true;
    this.modal.events.onInputDown.add(function() {
      window.open('http://play.google.com/store/apps/details?id=com.nhnent.Qpoker&hl=ko');

      //this.hideModal();
    }, this);
  },
  hideModal: function() {
    this.mask.destroy();
    this.modal.kill();
    if(this.modalCoin.kill) {
      this.modalCoin.kill();
    }
    if(this.rays.kill) {
      this.rays.kill();
    }
    this.isActivePresentModal = false;
  }
}
