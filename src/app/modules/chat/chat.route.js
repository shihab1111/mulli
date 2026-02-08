// app/modules/chat/chat.route.js
import { Router } from "express";
import { ChatController } from "./chat.controller.js";
import { fileUploader } from "../../helpers/fileUpload.js";


const router = Router();

router.post(
  "/send_message/:receiverId",
 fileUploader.upload.array("image", 5),
  ChatController.sendMessage,
);

router.get(
  "/conversations",
  ChatController.getConversations,
);
router.get(
  "/messages/:otherUserId",
  ChatController.getMessages,
);

export const chatRoutes = router;
