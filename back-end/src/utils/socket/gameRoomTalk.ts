import { Server, Socket } from 'socket.io';

// 다른 user들에게 offer를 보냄 (자신의 RTCSessionDescription)
const sendOffer = (socket: Socket, io: Server) => {
  socket.on('rtc offer', ({ sdp, title }) => {
    socket.broadcast.to(title).emit('rtc offer', sdp);
  });
};

// offer를 보낸 user에게 answer을 보냄 (자신의 RTCSessionDescription)
const sendAnswer = (socket: Socket, io: Server) => {
  socket.on('rtc answer', ({ sdp, title }) => {
    socket.broadcast.to(title).emit('rtc answer', sdp);
  });
};

// 자신의 ICECandidate 정보를 signal(offer 또는 answer)을 주고 받은 상대에게 전달
const sendCandidate = (socket: Socket, io: Server) => {
  socket.on('rtc candidate', ({ candidate, title }) => {
    socket.broadcast.to(title).emit('rtc candidate', candidate);
  });
};

const gameRoomTalk = (socket: Socket, io: Server) => {
  sendOffer(socket, io);

  sendAnswer(socket, io);

  sendCandidate(socket, io);
};

export default gameRoomTalk;
