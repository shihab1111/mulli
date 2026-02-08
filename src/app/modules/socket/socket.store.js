
let io;

export const setIo = (server) => {
  io = server;
};

export const getIo = () => {
  if (!io) throw new Error("❌ Socket.io not initialized");
  return io;
};
