
import User from "./user.model.js";
import { generateOtp, verifyOtp as verifyOtpUtil } from "../../utils/otp.util.js";
import { sendOtpEmail } from "../../utils/email.util.js";
import { sendOTP as sendPhoneSms } from "../../config/twilio.config.js";
import { redisClient } from "../../config/redis.config.js";

const OTP_EXPIRE = 3 * 60; // 3 minutes

// CREATE USER
export const createUser = async (data) => {
  let filter = {};
      
  if (data.email) {
    const subUser = await User.findOne({ email: data.email });
    if (!subUser || !subUser.isEmailVerified) {
      throw new Error("Email verification required");
    }
    filter = { email: data.email };
  } else if (data.phone) {
    const subUser = await User.findOne({ phone: data.phone });
    if (!subUser || !subUser.isPhoneVerified) {
      throw new Error("Phone verification required");
    }
    filter = { phone: data.phone };
  }

  // Update using email or phone as filter
  const userData = await User.findOneAndUpdate(
    filter,
    { ...data, isProfileComplete: true },
    { new: true }
  );

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
  const redisKey = `otp:email:${email}`;

  const storedOtp = await redisClient.get(redisKey);
  if (!storedOtp) {
    return { success: false, message: "OTP expired or not found" };
  }

  if (storedOtp !== inputOtp) {
    return { success: false, message: "Invalid OTP" };
  }

  // OTP valid → remove it
  await redisClient.del(redisKey);

  // 🔹 Find or create partial user
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      isEmailVerified: true,
      isProfileComplete: false,
      
    });
  } else {
   
  }

  return {
    success: true,
    message: "Email verified successfully",
    data: {
      userId: user._id,
      isEmailVerified: true,
      isProfileComplete: user.isProfileComplete,
      signupStep: user.signupStep,
    },
  };
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
