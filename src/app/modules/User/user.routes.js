import { Router } from "express";
import { fileUploader } from "../../helpers/fileUpload.js";
import { userControllers } from "./user.controller.js";

const router = Router();

// Email Signup Flow
router.post("/signup/email", userControllers.sendEmailOtp);
router.post("/signup/email/verify", userControllers.verifyEmailOtp);

// Phone Signup Flow  
router.post("/signup/phone", userControllers.sendPhoneOtp);
router.post("/signup/phone/verify", userControllers.verifyPhoneOtp);

// Complete User Profile
router.patch("/profile/complete", fileUploader.upload.array("image", 6), userControllers.createUser);
export const userRoutes = router;
