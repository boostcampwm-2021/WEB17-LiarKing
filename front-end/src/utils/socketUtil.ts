import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_HOST, { path: '/socket', secure: true });

const IS_WAITING_STATE = 'is waiting state'; //not server
const IS_USER_OWNER = 'is user owner'; //not server -> 서버 요청
const IS_USER_READY = 'is user ready'; //not server
const IS_ALL_READY = 'is all ready'; //not server
const ROOM_TITLE_INFO = 'room title info'; //not server -> 서버 요청
const ROOM_CLIENTS_INFO = 'room clients info'; //not server -> 서버 요청
const WAIT_ROOM_MESSAGE = 'wait room message'; //?
const ROOM_STATE_INFO = 'room state info'; //not server -> 서버 요청

const SELECT_DATA = 'select data'; //not server
const REQUEST_SELECT_DATA = 'request select data'; //not server -> 개별로 서버요청
const CHAT_HISTORY_DATA = 'chat history data'; //not server
const CHAT_SPEAKER_DATA = 'chat speaker data'; //not server
const VOTE_TIMER_DATA = 'vote timer data'; //not server
const RESULT_DATA = 'result data'; //not server
const LIAR_DATA = 'liar data'; //not server

const ROOM_EXIT = 'room exit'; //not server -> 서버 요청만
const ROOM_READY = 'room ready'; //not server -> 서버 요청만
const GAME_START = 'game start'; //not server -> 서버 요청만
const CHAT_MESSAGE_DATA = 'chat message data'; //not server -> 서버 요청만

type setStateType<T> = React.Dispatch<React.SetStateAction<T>>;
type roomTitleInfoType = { usersAmount: number; maxUsers: number; roomTitle: string };
type clientType = { socketId: string; name: string; state: string };
type chatDataType = { ment: string; userName: string; color: string };
type speakerDataType = { speaker: string; timer: number };
type resultType = { results: string[]; totalResult: string };
type liarType = { category: string[]; answer: number };

const on = {
  /**
   * Game의 GameBackground 컴포넌트에서 사용한다.
   * 현재 방의 상태가 waiting 일 경우 true, 그외 false를 서버로부터 반환받는다.
   * 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  IS_WAITING_STATE: ({ state, setState }: { state: boolean; setState: setStateType<boolean> }) => {
    socket.on(IS_WAITING_STATE, ({ isWaitingState }: { isWaitingState: boolean }) => {
      if (isWaitingState !== state) {
        setState(isWaitingState);
      }
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
   * GameButtons의 GameButtonsUser 컴포넌트에서 사용한다.
   * 해당 유저가 준비버튼을 클릭했을 때 서버로부터 제대로 값이 변했는지 boolean값으로 응답한다.
   * 준비된 상태일 경우 ture, 준비되지 않은 상태일 경우 false를 반환받는다.
   */
  IS_USER_READY: ({ setState }: { setState: setStateType<boolean> }) => {
    socket.on(IS_USER_READY, ({ isUserOwner }: { isUserOwner: boolean }) => {
      setState(isUserOwner);
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
      setState(clients);
    });
  },
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
  IS_WAITING_STATE: () => socket.off(IS_WAITING_STATE),
  IS_USER_OWNER: () => socket.off(IS_USER_OWNER),
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
  IS_USER_OWNER: () => socket.emit(IS_USER_OWNER, null),
  ROOM_EXIT: () => socket.emit(ROOM_EXIT, null),
  ROOM_READY: () => socket.emit(ROOM_READY, null),
  GAME_START: ({ categorys }: { categorys: string[] }) => socket.emit(GAME_START, { categorys }),
  ROOM_TITLE_INFO: () => socket.emit(ROOM_TITLE_INFO, null),
  ROOM_CLIENTS_INFO: () => socket.emit(ROOM_CLIENTS_INFO, null),
  WAIT_ROOM_MESSAGE: (messageInfo: any) => socket.emit(WAIT_ROOM_MESSAGE, messageInfo),
  ROOM_STATE_INFO: () => socket.emit(ROOM_STATE_INFO, null),
  REQUEST_SELECT_DATA: () => socket.emit(REQUEST_SELECT_DATA, null),
  CHAT_HISTORY_DATA: () => socket.emit(CHAT_HISTORY_DATA, null),
  CHAT_MESSAGE_DATA: ({ message }: { message: string }) => socket.emit(CHAT_MESSAGE_DATA, message),
};

export type socketUtilType = { on: typeof on; off: typeof off; emit: typeof emit };

export default { on, off, emit };
