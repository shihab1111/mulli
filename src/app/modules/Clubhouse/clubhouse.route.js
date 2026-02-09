import { Router } from "express";
import { postController } from "./clubhouse.controller.js";
import { fileUploader } from "../../helpers/fileUpload.js";



const router = Router();

router.post('/posts',fileUploader.upload.array('media', 5),postController.createPost
);
router.get("/", postController.getHomeFeed);

router.post("/like/:id", postController.likePost);
router.post ("/comment/:id", postController.commentPost);
router.post("/:id/gift", postController.sendGift);

const clubHouseRoutes= router;
export default clubHouseRoutes;