var CONFIG = {
  _config: {
    'IMAGE_POSITION_X': 55,   //  첫번째 Reel 이미지의 X 좌표
    'IMAGE_SIZE_X': 217,      //  이미지의 가로 넓이
    'IMAGE_SIZE_Y': 220,      //  이미지의 세로 넓이
    'BAR_POSITION_Y': 600,    //  슬로 바의 Y좌표
    'TOTAL_PLAY_COUNT': 3,    //  플레이 가능 횟수
    'REEL_POSITION_Y': 240,
    'COIN_TUNNEL_X': 80,
    'COIN_TUNNEL_Y': 950,
    'ITEMS': ['heart','king','seven', 'queen', 'poker', 'poker', 'poker']
  },
  getConfig: function(key) {
    var configData = this._config[key];
    if(!configData) {
      throw new Error('[' + key + '] is not included in the configuration!!');
    }
    return configData;
  }
};

var Message = {
  _message: {
    'modal.message.01': '축하합니다.\n{$}를 획득했습니다.',
    'modal.message.02': '한게임 포커에서 이어서 플레이',
    'modal.message.03': '아쉽지만\n모든 배팅 기회를\n사용 하셨습니다.'
  },
  getMessage: function(key, args) {
    var message = this._message[key];
    if(!message) {
      return '[ERROR] not defined "' + key + '"';
    }
    if(args && args.constructor === Array ) {
      for(var i = 0 ; i < args.length ; i++) {
        message = message.replace('{$}',args[i]);
      }
    }
    return message;
  }
};
