import { Router } from "express";
import { fileUploader } from "../../helpers/fileUpload.js";
import { userControllers } from "./user.controller.js";

const router = Router();

// Create User
router.post("/withPhone", fileUploader.upload.array("images", 6), userControllers.createUser);
router.post("/withEmail", fileUploader.upload.array("images", 6), userControllers.createUser);

// Email OTP
router.post("/otp/email", userControllers.sendEmailOtp);
router.post("/otp/email/verify", userControllers.verifyEmailOtp);

// Phone OTP
router.post("/otp/phone", userControllers.sendPhoneOtp);
router.post("/otp/phone/verify", userControllers.verifyPhoneOtp);

export const userRoutes = router;
