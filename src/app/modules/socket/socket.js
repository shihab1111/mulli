import { Server } from "socket.io";
import { chatSocket } from "./chat.socket.js";
import { notificationSocket } from "./notification.socket.js";

export const initSockets = (io) => {
  chatSocket(io);
  notificationSocket(io);
};
