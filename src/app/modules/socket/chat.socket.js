// app/modules/chat/chat.socket.ts
import { Server, Socket } from "socket.io";

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("💬 [Chat] client connected:", socket.id);

    // Join chat room
    socket.on("join-chat", (userId) => {
      socket.join(userId);
      console.log(`👥 ${socket.id} joined chat ${userId}`);
    });

    // Leave chat room
    socket.on("leave-chat", (userId) => {
      socket.leave(userId);
      console.log(`🚪 ${socket.id} left chat ${userId}`);
    });

    // Typing indicators
    socket.on("typing", (userId) => {
      socket.to(userId).emit("typing", { user: socket.id });
    });

    socket.on("stop-typing", (userId) => {
      socket.to(userId).emit("stop-typing", { user: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("❌ [Chat] disconnected:", socket.id);
    });
  });
};
