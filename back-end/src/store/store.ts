export const nicknameList = [];
export const idList = [];

export const roomList: Map<
  string,
  {
    title: string;
    password: string;
    max: number;
    client: { socketId: string; name: string; state: string }[];
    cycle: number;
    owner: string;
    state: string;
    chatHistory: string[];
    speakerData: { speaker: string; timer: number };
  }
> = new Map();

export const roomSecrets: Map<
  string,
  { liar: { socketId: string; name: string }; words: string[]; answerWord: string; vote: { name: string; count: number }[] }
> = new Map();

export const socketUser = {};

export const socketRoom = {};

roomList.set('방1', {
  title: '방1',
  password: '',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
  state: 'waiting',
  chatHistory: [],
  speakerData: { speaker: '', timer: 0 },
});

roomList.set('방2', {
  title: '방2',
  password: '',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
  state: 'waiting',
  chatHistory: [],
  speakerData: { speaker: '', timer: 0 },
});

roomList.set('방3', {
  title: '방3',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
  state: 'waiting',
  chatHistory: [],
  speakerData: { speaker: '', timer: 0 },
});
