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
