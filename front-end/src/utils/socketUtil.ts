import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_HOST, { path: '/socket', secure: true });

const IS_WAITING_STATE = 'is waiting state'; //not server
const IS_USER_OWNER = 'is user owner'; //not server -> 서버 요청
const IS_USER_READY = 'is user ready'; //not server
const IS_ALL_READY = 'is all ready'; //not server

const ROOM_EXIT = 'room exit'; //not server -> 서버 요청만
const ROOM_READY = 'room ready'; //not server -> 서버 요청만
const GAME_START = 'game start'; //not server -> 서버 요청만

const on = {
  /**
   * Game의 GameBackground 컴포넌트에서 사용한다.
   * 현재 방의 상태가 waiting 일 경우 true, 그외 false를 서버로부터 반환받는다.
   * true일 경우 배경필터가 미적용되고, false일 경우 배경필터가 적용된다.
   * 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  IS_WAITING_STATE: ({
    state,
    setState,
    filterClass,
  }: {
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
    filterClass: string;
  }) => {
    socket.on(IS_WAITING_STATE, ({ isWaitingState }: { isWaitingState: boolean }) => {
      if (isWaitingState && state !== '') {
        setState('');
      } else if (state !== filterClass) {
        setState(filterClass);
      }
    });
  },
  /**
   * GameButtons 컴포넌트에서 사용한다.
   * 서버에서 현재 방에 접속한 유저가 owner일 경우 true, 일반 게스트일 경우 false를 반환받는다.
   * 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  IS_USER_OWNER: ({ state, setState }: { state: boolean; setState: React.Dispatch<React.SetStateAction<boolean>> }) => {
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
  IS_USER_READY: ({ setState }: { setState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    socket.on(IS_USER_READY, ({ isUserOwner }: { isUserOwner: boolean }) => {
      setState(isUserOwner);
    });
  },
  /**
   * GameButtons의 GameButtonsOwner 컴포넌트에서 사용한다.
   * 해당 방의 모든 유저가 준비상태일 때 true, 그렇지 않을 경우 false를 반환받는다.
   * 이미 적용된 값과 같을경우 변경하지 않는다.
   */
  IS_ALL_READY: ({ state, setState }: { state: boolean; setState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    socket.on(IS_ALL_READY, ({ isAllReady }: { isAllReady: boolean }) => {
      if (isAllReady !== state) {
        setState(isAllReady);
      }
    });
  },
};

const off = {
  IS_WAITING_STATE: () => socket.off(IS_WAITING_STATE),
  IS_USER_OWNER: () => socket.off(IS_USER_OWNER),
  IS_USER_READY: () => socket.off(IS_USER_READY),
  IS_ALL_READY: () => socket.off(IS_ALL_READY),
};

const emit = {
  IS_USER_OWNER: () => socket.emit(IS_USER_OWNER, null),
  ROOM_EXIT: () => socket.emit(ROOM_EXIT, null),
  ROOM_READY: () => socket.emit(ROOM_READY, null),
  GAME_START: ({ categorys }: { categorys: string[] }) => socket.emit(GAME_START, { categorys }),
};

export type socketUtilType = { on: typeof on; off: typeof off; emit: typeof emit };

export default { on, off, emit };
