export const nicknameList = [];
export const idList = [];

export type roomInfoType = {
  title: string;
  password: string;
  max: number;
  client: { socketId: string; name: string; state: string }[];
  cycle: number;
  owner: string;
  state: string;
  chatHistory: { ment: string; userName: string; color: string }[];
  speakerData: { speaker: string; timer: number };
};

export type roomSecretType = {
  liar: { socketId: string; name: string };
  words: string[];
  answerWord: string;
  vote: { name: string; count: number }[];
};

//key : roomTitle
export const roomList: Map<string, roomInfoType> = new Map();

//key : roomTitle
export const roomSecrets: Map<string, roomSecretType> = new Map();

//key: socket.id
export const socketDatas: Map<string, { name: string; roomTitle: string }> = new Map();
