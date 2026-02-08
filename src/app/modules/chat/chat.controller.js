/* eslint-disable no-unused-vars */
import { chatService } from "./chat.service.js";
import { catchAsync} from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";

const sendMessage = catchAsync(
  async (req, res, next) => {
    const { receiverId } = req.params;
    const user = req.user;

    const result = await chatService.sendMessageService(
      user,
      receiverId,
      req.body,
    );

    // send response
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Message sent successfully!",
      data: result,
    });
  },
);

const getConversations = catchAsync(async (req, res) => {
  const user = req.user;

  const chats = await chatService.getConversationsService(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Conversations fetched successfully",
    data: chats,
  });
});

const getMessages = catchAsync(async (req, res) => {
  const user = req.user;
  const { otherUserId } = req.params;

  const messages = await chatService.getMessagesService(user, otherUserId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Messages fetched successfully",
    data: messages,
  });
});

export const ChatController = {
  sendMessage,
  getConversations,
  getMessages,
};
