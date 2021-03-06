import { SetterOrUpdater } from 'recoil';
import { io } from 'socket.io-client';

import { roomType } from '../components/pages/Lobby';
import { modalPropsType } from '../components/public/Modal';

export const socket = io(process.env.REACT_APP_SOCKET_HOST, { path: '/socket', secure: true, transports: ['websocket'] });

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
const END_VOTE = 'end vote';
const RESULT_DATA = 'result data';
const LIAR_DATA = 'liar data';
const ROOM_GAME_DISCONNECT = 'room game disconnect';

//lobby emit
const CREATE_ROOM = 'create room';
const LOBBY_LOGOUT = 'lobby logout';
const ROOM_JOIN = 'room join';
const LOBBY_ENTERED = 'lobby entered';

//game, room emit
const ROOM_READY = 'room ready';
const GAME_START = 'game start';
const CHAT_MESSAGE_DATA = 'chat message data';
const SETTING_CHANGE = 'setting change';
const VOTE_RESULT = 'vote result';

//web RTC
const SOMEONE_JOINED = 'someone joined';
const RTC_DISCONNECT = 'rtc disconnect';
const CURRENT_SPEAKER = 'current speaker';
const END_SPEAK = 'end speak';
const I_JOINED = 'i joined';
const RTC_INFO = 'rtc info';

type createRoomInfoType = {
  title: string;
  password: string;
  max: number;
  cycle: number;
  owner: string;
};
type setStateType<T> = React.Dispatch<React.SetStateAction<T>>;
type roomTitleInfoType = { usersAmount: number; maxUsers: number; roomTitle: string };
type clientType = { socketId: string; name: string; state: string; rank: string; rtc: string };
type chatDataType = { ment: string; userName: string; color: string };
type speakerDataType = { speaker: string; timer: number };
type voteDataType = { name: string };
type resultType = { results: string[]; totalResult: string; liar?: string; liarWins?: boolean };
type liarType = { category: string[]; answer: number; liar: string };
type roomSettingType = { max: number; cycle: number };
type roomSettingRecoilType = { category: any[]; max: number; cycle: number };
type categoryType = { category: string; include: boolean };

const on = {
  /**
   * CreateRoomModal ?????????????????? ????????????.
   * ?????? ????????? ?????????????????? ???????????? ???????????? ?????????.
   * false??? ?????? ????????? ???????????? ????????? ?????? ?????????.
   */
  IS_ROOM_CREATE: ({ success, error }: { success: () => void; error: () => void }) => {
    socket.on(IS_ROOM_CREATE, ({ isRoomCreate }: { isRoomCreate: boolean }) => {
      if (isRoomCreate) success();
      else error();
    });
  },
  /**
   * RoomList ?????????????????? ????????????.
   * ?????? ?????? ????????? ??????????????? ?????????.
   */
  ROOM_LIST: ({ setState }: { setState: setStateType<roomType[]> }) => {
    socket.on(ROOM_LIST, ({ roomList }: { roomList: roomType[] }) => {
      setState(roomList);
    });
  },
  /**
   * LobbyButtons ?????????????????? ????????????.
   * ?????? ????????? ?????????????????? ???????????? ???????????? ?????????.
   * false??? ?????? ????????? ????????? ??????.
   */
  ROOM_JOIN: ({ success, error }: { success: () => void; error: () => void }) => {
    socket.on(ROOM_JOIN, ({ isEnter }: { isEnter: boolean }) => {
      if (isEnter) success();
      else error();
    });
  },
  /**
   * Game??? GameBackground ?????????????????? ????????????.
   * ?????? ?????? ????????? waiting ??? ?????? true, ?????? false??? ??????????????? ???????????????.
   * ?????? ????????? ?????? ???????????? ???????????? ?????????.
   */
  IS_WAITING_STATE: ({ setState }: { setState: setStateType<boolean> }) => {
    socket.on(IS_WAITING_STATE, ({ isWaitingState }: { isWaitingState: boolean }) => {
      setState(isWaitingState);
    });
  },
  /**
   * GameButtons ?????????????????? ????????????.
   * ???????????? ?????? ?????? ????????? ????????? owner??? ?????? true, ?????? ???????????? ?????? false??? ???????????????.
   * ?????? ????????? ?????? ???????????? ???????????? ?????????.
   */
  IS_USER_OWNER: ({ state, setState }: { state: boolean; setState: setStateType<boolean> }) => {
    socket.on(IS_USER_OWNER, ({ isUserOwner }: { isUserOwner: boolean }) => {
      if (isUserOwner !== state) {
        setState(isUserOwner);
      }
    });
  },
  /**
   * GameRoomSetting ?????????????????? ????????????.
   * ????????? ????????? ??? ?????? ????????? ???????????? ?????? ?????? ???????????? ????????????.
   */
  SETTING_CHANGE: ({ setState, category }: { setState: SetterOrUpdater<roomSettingRecoilType>; category: categoryType[] }) => {
    socket.on(SETTING_CHANGE, ({ roomOwnerSetting }: { roomOwnerSetting: roomSettingType }) => {
      setState({ category, ...roomOwnerSetting });
    });
  },
  /**
   * ?????? ?????? ????????? ???????????? ????????? ???????????? ???
   * ??????????????? ???????????? ????????? ???????????? ????????????.
   */
  REQUEST_USER_OWNER: () => {
    socket.on(REQUEST_USER_OWNER, () => {
      emit.IS_USER_OWNER();
    });
  },
  /**
   * GameButtons??? GameButtonsUser ?????????????????? ????????????.
   * ?????? ????????? ??????????????? ???????????? ??? ??????????????? ????????? ?????? ???????????? boolean????????? ????????????.
   * ????????? ????????? ?????? ture, ???????????? ?????? ????????? ?????? false??? ???????????????.
   */
  IS_USER_READY: ({ setState }: { setState: setStateType<boolean> }) => {
    socket.on(IS_USER_READY, ({ isUserReady }: { isUserReady: boolean }) => {
      setState(isUserReady);
    });
  },
  /**
   * GameButtons??? GameButtonsOwner ?????????????????? ????????????.
   * ?????? ?????? ?????? ????????? ??????????????? ??? true, ????????? ?????? ?????? false??? ???????????????.
   * ?????? ????????? ?????? ???????????? ???????????? ?????????.
   */
  IS_ALL_READY: ({ state, setState }: { state: boolean; setState: setStateType<boolean> }) => {
    socket.on(IS_ALL_READY, ({ isAllReady }: { isAllReady: boolean }) => {
      if (isAllReady !== state) {
        setState(isAllReady);
      }
    });
  },
  /**
   * Game??? GameTitleInfo ?????????????????? ????????????.
   * ??????????????? ?????? ?????? ?????????, ????????????, ???????????? ???????????? ????????????.
   * ?????? ????????? ????????? ??? ????????? ?????? ????????? ?????? ???????????? ???????????? ?????????.
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
   * GamePersons ?????????????????? ????????????.
   * ?????? ?????? ?????? ???????????? ???????????? ????????????.
   */
  ROOM_CLIENTS_INFO: ({ setState }: { setState: setStateType<clientType[]> }) => {
    socket.on(ROOM_CLIENTS_INFO, ({ clients }: { clients: clientType[] }) => {
      while (clients.length < 8) {
        clients.push({ socketId: null, name: null, state: null, rank: null, rtc: null });
      }
      setState(clients);
    });
  },
  /**
   * GameChatBox ?????????????????? ????????????.
   * ??????????????? ?????? ???????????? ???????????? ?????????.
   */
  WAIT_ROOM_MESSAGE: (fn: (messageInfo: any) => void) => {
    socket.on(WAIT_ROOM_MESSAGE, (messageInfo: { userId: string; message: string; clientIdx: number }) => {
      fn(messageInfo);
    });
  },
  /**
   * GameContent ?????????????????? ????????????.
   * ??????????????? ?????? ????????? ???????????? ????????????.
   */
  ROOM_STATE_INFO: ({ dispatch }: { dispatch: React.Dispatch<{ type: string }> }) => {
    socket.on(ROOM_STATE_INFO, ({ roomState }: { roomState: string }) => {
      dispatch({ type: roomState });
    });
  },
  /**
   * GameContentSelect ?????????????????? ????????????.
   * ??????????????? ????????? ??????, ?????? ???????????? ????????? ???????????? ?????????.
   */
  SELECT_DATA: ({ setState }: { setState: setStateType<{ word: string }> }) => {
    socket.on(SELECT_DATA, ({ select }: { select: { word: string } }) => {
      setState(select);
    });
  },
  /**
   * GameContentSelect ?????????????????? ????????????.
   * ??????????????? ????????? ????????? ????????? ????????? selectData??? ??????????????? ??????.
   */
  REQUEST_SELECT_DATA: () => {
    socket.on(REQUEST_SELECT_DATA, () => {
      emit.REQUEST_SELECT_DATA();
    });
  },
  /**
   * GameContentChat??? GameContentChatHistory??? ????????????.
   * ???????????? ?????? ??????(??????, ????????????, ????????????)??? ????????????.
   */
  CHAT_HISTORY_DATA: ({ setState }: { setState: setStateType<chatDataType[]> }) => {
    socket.on(CHAT_HISTORY_DATA, ({ chatHistory }: { chatHistory: chatDataType[] }) => {
      setState(chatHistory);
    });
  },
  /**
   * GameContentChat??? GameContentChatSpeaker??? ????????????.
   * ???????????? ????????? ???????????? ??????????????? ????????????.
   */
  CHAT_SPEAKER_DATA: ({ setState }: { setState: setStateType<speakerDataType> }) => {
    socket.on(CHAT_SPEAKER_DATA, ({ speakerData }: { speakerData: speakerDataType }) => {
      setState(speakerData);
    });
  },
  /**
   * GameContentVote ?????????????????? ????????????.
   * ??????????????? ?????? ?????? ???????????? ????????????.
   */
  VOTE_TIMER_DATA: ({ setState }: { setState: setStateType<number> }) => {
    socket.on(VOTE_TIMER_DATA, ({ timer }: { timer: number }) => {
      setState(timer);
    });
  },
  /**
   * GameContentVote ?????????????????? ????????????.
   * ??????????????? ?????? ?????? ?????? ???????????? ????????????.
   */
  END_VOTE: ({ voteData }: { voteData: { name: string } }) => {
    socket.on(END_VOTE, () => {
      emit.VOTE_RESULT({ voteData });
    });
  },
  /**
   * GameContentResult ?????????????????? ????????????.
   * ??????????????? ?????? ???????????? ????????????.
   */
  RESULT_DATA: ({ setState }: { setState: setStateType<resultType> }) => {
    socket.on(RESULT_DATA, ({ resultData }: { resultData: resultType }) => {
      setState(resultData);
    });
  },
  /**
   * GameContentLiar ?????????????????? ????????????.
   * ??????????????? ???????????? ?????? ????????? ????????????.
   */
  LIAR_DATA: ({ setState }: { setState: setStateType<liarType> }) => {
    socket.on(LIAR_DATA, ({ liarData }: { liarData: liarType }) => {
      setState(liarData);
    });
  },
  ROOM_GAME_DISCONNECT: ({ popModal }: { popModal: (modalProps: modalPropsType) => void }) => {
    socket.on(ROOM_GAME_DISCONNECT, ({ userId }: { userId: string }) => {
      console.log('disconnect!');
      popModal({ type: 'warning', ment: `${userId}?????? ????????? ??????????????????.\n????????? ????????? ???????????????.` });
    });
  },
  SOMEONE_JOINED: ({ fn }: { fn: ({ peerId }: { peerId: string }) => void }) => {
    socket.on(SOMEONE_JOINED, ({ peerId }: { peerId: string }) => {
      fn({ peerId });
    });
  },
  RTC_DISCONNECT: ({ fn }: { fn: ({ peerId }: { peerId: string }) => void }) => {
    socket.on(RTC_DISCONNECT, ({ peerId }: { peerId: string }) => {
      fn({ peerId });
    });
  },
  CURRENT_SPEAKER: ({ fn }: { fn: ({ speaker }: { speaker: string }) => void }) => {
    socket.on(CURRENT_SPEAKER, ({ speaker }: { speaker: string }) => {
      fn({ speaker });
    });
  },
  END_SPEAK: ({ fn }: { fn: () => void }) => {
    socket.on(END_SPEAK, () => {
      fn();
    });
  },
};

const off = {
  IS_ROOM_CREATE: () => socket.off(IS_ROOM_CREATE),
  ROOM_LIST: () => socket.off(ROOM_LIST),
  ROOM_JOIN: () => socket.off(ROOM_JOIN),
  IS_WAITING_STATE: () => socket.off(IS_WAITING_STATE),
  IS_USER_OWNER: () => socket.off(IS_USER_OWNER),
  SETTING_CHANGE: () => socket.off(SETTING_CHANGE),
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
  END_VOTE: () => socket.off(END_VOTE),
  RESULT_DATA: () => socket.off(RESULT_DATA),
  LIAR_DATA: () => socket.off(LIAR_DATA),
  ROOM_GAME_DISCONNECT: () => socket.off(ROOM_GAME_DISCONNECT),
  SOMEONE_JOINED: () => socket.off(SOMEONE_JOINED),
  RTC_DISCONNECT: () => socket.off(RTC_DISCONNECT),
  CURRENT_SPEAKER: () => socket.off(CURRENT_SPEAKER),
  END_SPEAK: () => socket.off(END_SPEAK),
};

const emit = {
  CREATE_ROOM: ({ roomInfo }: { roomInfo: createRoomInfoType }) => socket.emit(CREATE_ROOM, { roomInfo }),
  ROOM_LIST: () => socket.emit(ROOM_LIST, null),
  ROOM_JOIN: ({ roomTitle }: { roomTitle: string }) => socket.emit(ROOM_JOIN, { roomTitle }),
  LOBBY_ENTERED: ({ userId, rank }: { userId: string; rank: string }) => socket.emit(LOBBY_ENTERED, { userId, rank }),
  IS_USER_OWNER: () => socket.emit(IS_USER_OWNER, null),
  LOBBY_LOGOUT: () => socket.emit(LOBBY_LOGOUT, null),
  ROOM_READY: () => socket.emit(ROOM_READY, null),
  GAME_START: ({ categorys }: { categorys: string[] }) => socket.emit(GAME_START, { categorys }),
  ROOM_TITLE_INFO: () => socket.emit(ROOM_TITLE_INFO, null),
  ROOM_CLIENTS_INFO: () => socket.emit(ROOM_CLIENTS_INFO, null),
  WAIT_ROOM_MESSAGE: (messageInfo: any) => socket.emit(WAIT_ROOM_MESSAGE, messageInfo),
  ROOM_STATE_INFO: () => socket.emit(ROOM_STATE_INFO, null),
  REQUEST_SELECT_DATA: () => socket.emit(REQUEST_SELECT_DATA, null),
  CHAT_MESSAGE_DATA: ({ message }: { message: string }) => socket.emit(CHAT_MESSAGE_DATA, { message }),
  SETTING_CHANGE: ({ roomSetting }: { roomSetting: roomSettingType }) => socket.emit(SETTING_CHANGE, { roomSetting }),
  VOTE_RESULT: ({ voteData }: { voteData: voteDataType }) => socket.emit(VOTE_RESULT, { voteData }),
  LIAR_DATA: ({ liarResult }: { liarResult: { isAnswer: boolean } }) => socket.emit(LIAR_DATA, { liarResult }),
  I_JOINED: ({ peerId }: { peerId: string }) => socket.emit(I_JOINED, { peerId }),
  RTC_INFO: ({ state }: { state: boolean }) => socket.emit(RTC_INFO, { state }),
};

export type socketUtilType = { on: typeof on; off: typeof off; emit: typeof emit };

export default { on, off, emit };
