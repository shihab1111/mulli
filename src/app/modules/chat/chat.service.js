/* eslint-disable no-explicit-any */

import AppError from "../../errorHelpers/AppError.js";
import { getIo } from "../socket/socket.store.js";
import User from "../User/user.model.js";
import Message from "./message.model.js";

// import { NotificationService } from "../notification/notification.service.js";

const sendMessageService = async (
  user,
  receiverId,
  payload,
) => {
//   const senderId = user.userId;
  const senderId = "69881c8f04c3ff643148c27d"
  const isReceiverExist = await User.findById(receiverId);
  if (!isReceiverExist) {
    throw new AppError(404, "Receiver not found");
  }

  const sendMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message: {
      text: payload.message?.text,
      image: payload.message?.image,
    },
    status: payload.status,
  });

  const io = getIo();

  io.to(receiverId).emit("message", sendMessage);
  // TODO: Enable notification when service is ready
  // await NotificationService.notifyChatMessage(
  //   receiverId,
  //   senderId,
  //   sendMessage,
  // );

  return sendMessage;
};

const getConversationsService = async (user) => {
  const userId = user.userId;

  // Find all messages where user is sender or receiver
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "full_name email profile_picture")
    .populate("receiver", "full_name email profile_picture")
    .sort({ createdAt: -1 });

  // Map to store unique conversations
  const conversationsMap = new Map();

  messages.forEach((msg) => {
    const sender = msg.sender;
    const receiver = msg.receiver;

    // Determine the "other user"
    const otherUser = sender?._id.toString() === userId ? receiver : sender;

    if (!otherUser) return; // skip if somehow undefined

    if (!conversationsMap.has(otherUser._id.toString())) {
      conversationsMap.set(otherUser._id.toString(), {
        user: otherUser,
        lastMessage: msg,
      });
    }
  });

  // Convert Map to array
  const conversations = Array.from(conversationsMap.values());

  return conversations;
};

const getMessagesService = async (user, otherUserId) => {
  const userId = "69881c8f04c3ff643148c27d";

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  })
    .populate("sender", "full_name email profile_picture")
    .populate("receiver", "full_name email profile_picture")
    .populate({
      path: "replyTo",
      populate: { path: "sender", select: "full_name email" },
    })
    .sort({ createdAt: 1 });

  return messages;
};

export const chatService = {
  sendMessageService,
  getConversationsService,
  getMessagesService,
};
