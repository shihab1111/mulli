import { Router } from "express";

import { giftControllers } from "./gift.controller.js";

const router = Router();

router.post("/send",  giftControllers.sendGift);
router.get("/sent",  giftControllers.getSentGifts);
router.get("/received",  giftControllers.getReceivedGifts);

export const giftroutes=router;
