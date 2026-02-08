
import User from "./user.model.js";
import { generateOtp, verifyOtp as verifyOtpUtil } from "../../utils/otp.util.js";
import { sendOtpEmail } from "../../utils/email.util.js";
import { sendOTP as sendPhoneSms } from "../../config/twilio.config.js";
import { redisClient } from "../../config/redis.config.js";

const OTP_EXPIRE = 3 * 60; // 3 minutes

// CREATE USER
export const createUser = async (data) => {
  const userData = await User.create(data);
  return userData;
};

// GENERATE & SEND EMAIL OTP
export const createEmailOtp = async (email) => {
  const otp = generateOtp();
  await sendOtpEmail({ to: email, otp });
  await redisClient.setex(`otp:email:${email}`, OTP_EXPIRE, otp);
  return otp;
};

// VERIFY EMAIL OTP
export const verifyEmailOtp = async (email, inputOtp) => {
  const storedOtp = await redisClient.get(`otp:email:${email}`);
  if (!storedOtp) return { success: false, message: "OTP expired or not found" };
  if (storedOtp !== inputOtp) return { success: false, message: "Invalid OTP" };

  await redisClient.del(`otp:email:${email}`);
  return { success: true, message: "OTP verified successfully" };
};

// GENERATE & SEND PHONE OTP
export const createPhoneOtp = async (phoneNumber) => {
  const otp = generateOtp();
  const otpKey = `otp:phone:${phoneNumber}`;
  await redisClient.setex(otpKey, OTP_EXPIRE, otp);

  const result = await sendPhoneSms(phoneNumber, otp);
  if (!result.success) throw new Error(result.message);

  return { otp, message: "OTP sent successfully" };
};

// VERIFY PHONE OTP
export const verifyPhoneOtp = async (phoneNumber, otp) => {
  const otpKey = `otp:phone:${phoneNumber}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) return { success: false, message: "OTP expired or not found" };
  if (storedOtp !== otp) return { success: false, message: "Invalid OTP" };

  await redisClient.del(otpKey);
  return { success: true, message: "OTP verified successfully" };
};
