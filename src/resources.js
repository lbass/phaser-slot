var CONFIG = {
  _config: {
    'GAME_WIDTH': 720,
    'GAME_HEIGHT': 1230,
    'IMAGE_POSITION_X': 55,   //  첫번째 Reel 이미지의 X 좌표
    'IMAGE_SIZE_X': 217,      //  이미지의 가로 넓이
    'IMAGE_SIZE_Y': 220,      //  이미지의 세로 넓이
    'BAR_POSITION_Y': 704,    //  슬로 바의 Y좌표
    'BAR_POSITION_X': 273,
    'TOTAL_PLAY_COUNT': 3,    //  플레이 가능 횟수
    'REEL_POSITION_Y': 350,
    'COIN_TUNNEL_Y': 1025,
    'ITEM_TEXT_POSITION_X': 206,
    'HEADER_POSITION_X': 205,
    'HEADER_POSITION_Y': 435,
    'COIN_GROUP_POSITION_X': 110,
    'TALK_POSITION_X': 424,
    'TALK_POSITION_Y': 760,
    'SOUND_ONOFF_BUTTON_X': 570,
    'SOUND_ONOFF_BUTTON_Y': 15,
    'CLOSE_BUTTON_X': 640,
    'CLOSE_BUTTON_Y': 15,
    'ITEMS': ['heart','king','seven', 'queen', 'poker', 'poker', 'poker']
    //'ITEMS': ['poker','poker','poker', 'poker', 'poker', 'poker', 'poker']
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
