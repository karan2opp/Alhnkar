import { Server } from 'socket.io';

let io;

export const init = (server) => {
  io = new Server(server, {
    cors: { origin: "*"}
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', ({ role }) => {
      if (role === 'admin') {
        socket.join('admin_room');
      } else if (role === 'user') {
        socket.join('user_room');
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};