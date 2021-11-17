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
  }
> = new Map();

export const roomSecrets: Map<string, { liarName: string; words: string[]; answerWord: string; vote: { name: string; count: number }[] }> = new Map();

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
});

roomList.set('방2', {
  title: '방2',
  password: '',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
  state: 'waiting',
});

roomList.set('방3', {
  title: '방3',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
  state: 'waiting',
});

roomList.set('방4', {
  title: '방4',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방5', {
  title: '방5',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방6', {
  title: '방6',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방7', {
  title: '방7',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방8', {
  title: '방8',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방9', {
  title: '방9',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방10', {
  title: '방10',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방11', {
  title: '방11',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});
