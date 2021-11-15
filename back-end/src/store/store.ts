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
  }
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
});

roomList.set('방2', {
  title: '방2',
  password: '',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});

roomList.set('방3', {
  title: '방3',
  password: '123123',
  max: 8,
  client: [],
  cycle: 1,
  owner: '주인장',
});
