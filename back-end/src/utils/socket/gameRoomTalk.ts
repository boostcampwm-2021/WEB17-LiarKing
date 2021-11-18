import { Server, Socket } from 'socket.io';

const RTC_MESSAGE = {
  OFFER: 'rtc offer',
  ANSWER: 'rtc answer',
  CANDIDATE: 'rtc candidate',
};

const sendOffer = (socket: Socket, io: Server) => {
  socket.on(RTC_MESSAGE.OFFER, ({ sdp, fromSocketId, toSocketId }) => {
    socket.to(toSocketId).emit(RTC_MESSAGE.OFFER, { sdp, fromSocketId });
  });
};

const sendAnswer = (socket: Socket, io: Server) => {
  socket.on(RTC_MESSAGE.ANSWER, ({ sdp, fromSocketId, toSocketId }) => {
    socket.to(toSocketId).emit(RTC_MESSAGE.ANSWER, { sdp, fromSocketId });
  });
};

const sendCandidate = (socket: Socket, io: Server) => {
  socket.on(RTC_MESSAGE.CANDIDATE, ({ candidate, fromSocketId, toSocketId }) => {
    socket.to(toSocketId).emit(RTC_MESSAGE.CANDIDATE, { candidate, fromSocketId });
  });
};

const sendMyTurn = (socket: Socket, io: Server) => {
  socket.on('myturn', ({ roomTitle }) => {
    socket.broadcast.to(roomTitle).emit('myturn');
  });
};

const gameRoomTalk = (socket: Socket, io: Server) => {
  sendOffer(socket, io);

  sendAnswer(socket, io);

  sendCandidate(socket, io);

  sendMyTurn(socket, io);
};

export default gameRoomTalk;
