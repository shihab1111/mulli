import express from "express";
import { getMyLikes, getMyPasses, likeUser, passUser } from "./swipe.controllers.js";


const router = express.Router();

router.post("/like",  likeUser);
router.post("/pass",  passUser);
router.get("/likes", getMyLikes);
router.get("/passes",  getMyPasses);

export const swipeRoutes = router;
    