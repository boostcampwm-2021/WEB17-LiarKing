const RTC_MESSAGE = {
  OFFER: 'rtc offer',
  ANSWER: 'rtc answer',
  CANDIDATE: 'rtc candidate',
};

const ROOM_MEESSAGE = {
  CREATE: 'room create',
  LIST: 'room list',
  EXIT: 'room exit',
  DATA: 'room data',
  JOIN: 'room join',
};

const LOBBY_MESSAGE = {
  ENTER: 'lobby entered',
};

const GAME_MESSAGE = {
  USER_READY: 'user ready',
  WORD_SELECT: 'word select',
  GET_WORD: 'get word',
  CHAT_DATA: 'chat data',
  ON_VOTE: 'on vote',
  END_VOTE: 'end vote',
  VOTE_RESULT: 'vote result',
};

export { RTC_MESSAGE, ROOM_MEESSAGE, LOBBY_MESSAGE, GAME_MESSAGE };
