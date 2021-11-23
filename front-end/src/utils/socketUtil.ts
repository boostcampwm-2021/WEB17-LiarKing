import { io } from 'socket.io-client';

import { roomType } from '../components/pages/Lobby';

export const socket = io(process.env.REACT_APP_SOCKET_HOST, { path: '/socket', secure: true });

//lobby on
const IS_ROOM_CREATE = 'is room create';
const ROOM_LIST = 'room list';

//room on
const IS_WAITING_STATE = 'is waiting state';
const IS_USER_OWNER = 'is user owner';
const REQUEST_USER_OWNER = 'request user owner';
const IS_USER_READY = 'is user ready';
const IS_ALL_READY = 'is all ready';
const ROOM_TITLE_INFO = 'room title info';
const ROOM_CLIENTS_INFO = 'room clients info';
const WAIT_ROOM_MESSAGE = 'wait room message';

//game on
const ROOM_STATE_INFO = 'room state info';
const SELECT_DATA = 'select data';
const REQUEST_SELECT_DATA = 'request select data';
const CHAT_HISTORY_DATA = 'chat history data';
const CHAT_SPEAKER_DATA = 'chat speaker data';
const VOTE_TIMER_DATA = 'vote timer data';
const RESULT_DATA = 'result data';
const LIAR_DATA = 'liar data';

//lobby emit
const CREATE_ROOM = 'create room';
const LOBBY_LOGOUT = 'lobby logout';
const ROOM_JOIN = 'room join';
const LOBBY_ENTERED = 'lobby entered';

//game, room emit
const ROOM_EXIT = 'room exit';
const ROOM_READY = 'room ready';
const GAME_START = 'game start';
const CHAT_MESSAGE_DATA = 'chat message data';
const SETTING_CHANGE = 'setting change';

type createRoomInfoType = {
  title: string;
  password: string;
  max: number;
  cycle: number;
  owner: string;
};
type setStateType<T> = React.Dispatch<React.SetStateAction<T>>;
type roomTitleInfoType = { usersAmount: number; maxUsers: number; roomTitle: string };
type clientType = { socketId: string; name: string; state: string };
type chatDataType = { ment: string; userName: string; color: string };
type speakerDataType = { speaker: string; timer: number };
type resultType = { results: string[]; totalResult: string };
type liarType = { category: string[]; answer: number };
type roomSettingType = { max: number; cycle: number };

const on = {
  /**
   * Lobby 컴포넌트에서 사용한다.
   * 방이 제대로 만들어졌는지 서버에서 데이터를 받는다.
   * false일 경우 방제가 중복되어 만들어 지지 않았다.
   */
  IS_ROOM_CREATE: ({ success, error }: { success: () => void; error: () => void }) => {
    socket.on(IS_ROOM_CREATE, ({ isRoomCreate }: { isRoomCreate: boolean }) => {
      if (isRoomCreate) success();
      else error();
    });
  },
  /**
   * RoomList 컴포넌트에서 사용한다.
   * 방의 목록 정보를 서버로부터 받는다.
   */
  ROOM_LIST: ({ setState }: { setState: setStateType<roomType[]> }) => {
    socket.on(ROOM_LIST, ({ roomList }: { roomList: roomType[] }) => {
      setState(roomList);
    });
  },
  /**
   * LobbyButtons 컴포넌트에서 사용한다.
   * 방이 제대로 입장가능한지 서버에서 데이터를 받는다.
   * false일 경우 입장이 불가능 하다.
   */
  ROOM_JOIN: ({ success, error }: { success: () => void; error: () => void }) => {
    socket.on(ROOM_JOIN, ({ isEnter }: { isEnter: boolean }) => {
      if (isEnter) success();
      else error();
    });
  },
  /**
   * Game의 GameBackground 컴포넌트에서 사용한다.
   * 현재 방의 상태가 waiting 일 경우 true, 그외 false를 서버로부터 반환받는다.
   * 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  IS_WAITING_STATE: ({ setState }: { setState: setStateType<boolean> }) => {
    socket.on(IS_WAITING_STATE, ({ isWaitingState }: { isWaitingState: boolean }) => {
      setState(isWaitingState);
    });
  },
  /**
   * GameButtons 컴포넌트에서 사용한다.
   * 서버에서 현재 방에 접속한 유저가 owner일 경우 true, 일반 게스트일 경우 false를 반환받는다.
   * 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  IS_USER_OWNER: ({ state, setState }: { state: boolean; setState: setStateType<boolean> }) => {
    socket.on(IS_USER_OWNER, ({ isUserOwner }: { isUserOwner: boolean }) => {
      if (isUserOwner !== state) {
        setState(isUserOwner);
      }
    });
  },
  /**
   * 게임 방에 입장한 상태에서 방장이 바뀌었을 때
   * 서버로부터 요청받아 새롭게 데이터를 불러온다.
   */
  REQUEST_USER_OWNER: () => {
    socket.on(REQUEST_USER_OWNER, () => {
      emit.IS_USER_OWNER();
    });
  },
  /**
   * GameButtons의 GameButtonsUser 컴포넌트에서 사용한다.
   * 해당 유저가 준비버튼을 클릭했을 때 서버로부터 제대로 값이 변했는지 boolean값으로 응답한다.
   * 준비된 상태일 경우 ture, 준비되지 않은 상태일 경우 false를 반환받는다.
   */
  IS_USER_READY: ({ setState }: { setState: setStateType<boolean> }) => {
    socket.on(IS_USER_READY, ({ isUserReady }: { isUserReady: boolean }) => {
      setState(isUserReady);
    });
  },
  /**
   * GameButtons의 GameButtonsOwner 컴포넌트에서 사용한다.
   * 해당 방의 모든 유저가 준비상태일 때 true, 그렇지 않을 경우 false를 반환받는다.
   * 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  IS_ALL_READY: ({ state, setState }: { state: boolean; setState: setStateType<boolean> }) => {
    socket.on(IS_ALL_READY, ({ isAllReady }: { isAllReady: boolean }) => {
      if (isAllReady !== state) {
        setState(isAllReady);
      }
    });
  },
  /**
   * Game의 GameTitleInfo 컴포넌트에서 사용한다.
   * 서버로부터 해당 방의 사람수, 최대인원, 방제목의 데이터를 받아온다.
   * 각각 다르게 변경할 수 있으며 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  ROOM_TITLE_INFO: ({ state, setState }: { state: roomTitleInfoType; setState: setStateType<roomTitleInfoType> }) => {
    socket.on(ROOM_TITLE_INFO, ({ usersAmount, maxUsers, roomTitle }: { usersAmount?: number; maxUsers?: number; roomTitle?: string }) => {
      const changeObject = {};

      if (!!usersAmount && state.usersAmount !== usersAmount) {
        Object.assign(changeObject, { usersAmount });
      }

      if (!!maxUsers && state.maxUsers !== maxUsers) {
        Object.assign(changeObject, { maxUsers });
      }

      if (!!roomTitle && state.roomTitle !== roomTitle) {
        Object.assign(changeObject, { roomTitle });
      }

      if (Object.keys(changeObject).length === 0) return;

      setState({ ...state, ...changeObject });
    });
  },
  /**
   * GamePersons 컴포넌트에서 사용한다.
   * 해당 방에 있는 사람들의 데이터를 받아온다.
   */
  ROOM_CLIENTS_INFO: ({ setState }: { setState: setStateType<clientType[]> }) => {
    socket.on(ROOM_CLIENTS_INFO, ({ clients }: { clients: clientType[] }) => {
      while (clients.length < 8) {
        clients.push({ socketId: null, name: null, state: null });
      }
      setState(clients);
    });
  },
  /**
   * GameChatBox 컴포넌트에서 사용한다.
   * 대기상태일 때의 주고받는 메세지를 받는다.
   */
  WAIT_ROOM_MESSAGE: (fn: (messageInfo: any) => void) => {
    socket.on(WAIT_ROOM_MESSAGE, (messageInfo: { userId: string; message: string; clientIdx: number }) => {
      fn(messageInfo);
    });
  },
  /**
   * GameContent 컴포넌트에서 사용한다.
   * 서버로부터 방의 상태를 문자열로 받아온다.
   */
  ROOM_STATE_INFO: ({ dispatch }: { dispatch: React.Dispatch<{ type: string }> }) => {
    socket.on(ROOM_STATE_INFO, ({ roomState }: { roomState: string }) => {
      dispatch({ type: roomState });
    });
  },
  /**
   * GameContentSelect 컴포넌트에서 사용한다.
   * 서버로부터 선택된 단어, 혹은 라이어가 표시된 문자열을 받는다.
   */
  SELECT_DATA: ({ setState }: { setState: setStateType<{ word: string }> }) => {
    socket.on(SELECT_DATA, ({ select }: { select: { word: string } }) => {
      setState(select);
    });
  },
  /**
   * GameContentSelect 컴포넌트에서 사용한다.
   * 서버로부터 신호를 받으면 개별로 서버에 selectData를 요청하도록 한다.
   */
  REQUEST_SELECT_DATA: () => {
    socket.on(REQUEST_SELECT_DATA, () => {
      emit.REQUEST_SELECT_DATA();
    });
  },
  /**
   * GameContentChat의 GameContentChatHistory에 사용된다.
   * 서버에서 채팅 내용(멘트, 유저이름, 유저색상)을 받아온다.
   */
  CHAT_HISTORY_DATA: ({ setState }: { setState: setStateType<chatDataType[]> }) => {
    socket.on(CHAT_HISTORY_DATA, ({ chatHistory }: { chatHistory: chatDataType[] }) => {
      setState(chatHistory);
    });
  },
  /**
   * GameContentChat의 GameContentChatSpeaker에 사용된다.
   * 서버에서 발언자 아이디와 발언시간을 받아온다.
   */
  CHAT_SPEAKER_DATA: ({ setState }: { setState: setStateType<speakerDataType> }) => {
    socket.on(CHAT_SPEAKER_DATA, ({ speakerData }: { speakerData: speakerDataType }) => {
      setState(speakerData);
    });
  },
  /**
   * GameContentVote 컴포넌트에서 사용한다.
   * 서버로부터 투표 시간 데이터를 받아온다.
   */
  VOTE_TIMER_DATA: ({ setState }: { setState: setStateType<number> }) => {
    socket.on(VOTE_TIMER_DATA, ({ timer }: { timer: number }) => {
      setState(timer);
    });
  },
  /**
   * GameContentResult 컴포넌트에서 사용한다.
   * 서버로부터 결과 데이터를 받아온다.
   */
  RESULT_DATA: ({ setState }: { setState: setStateType<resultType> }) => {
    socket.on(RESULT_DATA, ({ resultData }: { resultData: resultType }) => {
      setState(resultData);
    });
  },
  /**
   * GameContentLiar 컴포넌트에서 사용한다.
   * 서버로부터 단어들과 정답 번호를 받아온다.
   */
  LIAR_DATA: ({ setState }: { setState: setStateType<liarType> }) => {
    socket.on(LIAR_DATA, ({ liarData }: { liarData: liarType }) => {
      setState(liarData);
    });
  },
};

const off = {
  IS_ROOM_CREATE: () => socket.off(IS_ROOM_CREATE),
  ROOM_LIST: () => socket.off(ROOM_LIST),
  ROOM_JOIN: () => socket.off(ROOM_JOIN),
  IS_WAITING_STATE: () => socket.off(IS_WAITING_STATE),
  IS_USER_OWNER: () => socket.off(IS_USER_OWNER),
  REQUEST_USER_OWNER: () => socket.off(REQUEST_USER_OWNER),
  IS_USER_READY: () => socket.off(IS_USER_READY),
  IS_ALL_READY: () => socket.off(IS_ALL_READY),
  ROOM_TITLE_INFO: () => socket.off(ROOM_TITLE_INFO),
  ROOM_CLIENTS_INFO: () => socket.off(ROOM_CLIENTS_INFO),
  WAIT_ROOM_MESSAGE: () => socket.off(WAIT_ROOM_MESSAGE),
  ROOM_STATE_INFO: () => socket.off(ROOM_STATE_INFO),
  SELECT_DATA: () => socket.off(SELECT_DATA),
  REQUEST_SELECT_DATA: () => socket.off(REQUEST_SELECT_DATA),
  CHAT_HISTORY_DATA: () => socket.off(CHAT_HISTORY_DATA),
  CHAT_SPEAKER_DATA: () => socket.off(CHAT_SPEAKER_DATA),
  VOTE_TIMER_DATA: () => socket.off(VOTE_TIMER_DATA),
  RESULT_DATA: () => socket.off(RESULT_DATA),
  LIAR_DATA: () => socket.off(LIAR_DATA),
};

const emit = {
  CREATE_ROOM: ({ roomInfo }: { roomInfo: createRoomInfoType }) => socket.emit(CREATE_ROOM, { roomInfo }),
  ROOM_LIST: () => socket.emit(ROOM_LIST, null),
  ROOM_JOIN: ({ roomTitle }: { roomTitle: string }) => socket.emit(ROOM_JOIN, { roomTitle }),
  LOBBY_ENTERED: ({ userId }: { userId: string }) => socket.emit(LOBBY_ENTERED, { userId }),
  IS_USER_OWNER: () => socket.emit(IS_USER_OWNER, null),
  LOBBY_LOGOUT: () => socket.emit(LOBBY_LOGOUT, null),
  ROOM_EXIT: () => socket.emit(ROOM_EXIT, null),
  ROOM_READY: () => socket.emit(ROOM_READY, null),
  GAME_START: ({ categorys }: { categorys: string[] }) => socket.emit(GAME_START, { categorys }),
  ROOM_TITLE_INFO: () => socket.emit(ROOM_TITLE_INFO, null),
  ROOM_CLIENTS_INFO: () => socket.emit(ROOM_CLIENTS_INFO, null),
  WAIT_ROOM_MESSAGE: (messageInfo: any) => socket.emit(WAIT_ROOM_MESSAGE, messageInfo),
  ROOM_STATE_INFO: () => socket.emit(ROOM_STATE_INFO, null),
  REQUEST_SELECT_DATA: () => socket.emit(REQUEST_SELECT_DATA, null),
  CHAT_MESSAGE_DATA: ({ message }: { message: string }) => socket.emit(CHAT_MESSAGE_DATA, { message }),
  SETTING_CHANGE: ({ roomSetting }: { roomSetting: roomSettingType }) => socket.emit(SETTING_CHANGE, { roomSetting }),
};

export type socketUtilType = { on: typeof on; off: typeof off; emit: typeof emit };

export default { on, off, emit };
