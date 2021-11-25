import { Socket } from 'socket.io';

const MOVE_TO_MAIN = 'move to main';

const disconnectData = ({ socket }: { socket: Socket }) => {
  socket.emit(MOVE_TO_MAIN, null);
};

export default disconnectData;
