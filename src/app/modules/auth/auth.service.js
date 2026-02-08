// modules/auth/auth.service.js

import { createUserTokens, createNewAccessTokenWithRefreshToken } from "../../utils/userTokens.js";
import { verifyToken } from "../../utils/jwt.js";
import { envVars } from "../../config/env.js";
import User from "../User/user.model.js";
import * as userService from "../User/user.service.js";

// Send OTP to Email
const sendEmailOtp = async (email) => {
  try {
    const otp = await userService.createEmailOtp(email);
    return {
      success: true,
      message: "OTP sent successfully to your email",
      data: { email },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
};

// Send OTP to Phone
const sendPhoneOtp = async (phoneNumber) => {
  try {
    const result = await userService.createPhoneOtp(phoneNumber);
    return {
      success: true,
      message: result.message || "OTP sent successfully to your phone",
      data: { phoneNumber },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
};

// Login with Email OTP
const loginWithEmail = async (email, otp) => {
  try {
    // Verify OTP using user service
    const otpVerification = await userService.verifyEmailOtp(email, otp);

    if (!otpVerification.success) {
      return {
        success: false,
        message: otpVerification.message,
      };
    }

    // Find user by email
    let user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "User not found. Please sign up first.",
      };
    }

    // Update email verification status
    user.isEmailVerified = true;
    await user.save();

    // Generate tokens
    const tokens = createUserTokens(user);

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};

// Login with Phone OTP
const loginWithPhone = async (phoneNumber, otp) => {
  try {
    // Verify OTP using user service
    const otpVerification = await userService.verifyPhoneOtp(phoneNumber, otp);

    if (!otpVerification.success) {
      return {
        success: false,
        message: otpVerification.message,
      };
    }

    // Find user by phone
    let user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      return {
        success: false,
        message: "User not found. Please sign up first.",
      };
    }

    // Update phone verification status
    user.isPhoneVerified = true;
    await user.save();

    // Generate tokens
    const tokens = createUserTokens(user);

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};

// Get current user from cookies
const getMe = async (cookies) => {
  const accessToken = cookies?.accessToken;

  if (!accessToken) {
    throw new Error("Access token missing");
  }

  // Verify token
  const decoded = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);

  // Validate decoded token
  if (typeof decoded === "string" || !decoded || typeof decoded.email !== "string") {
    throw new Error("Invalid token payload");
  }

  const email = decoded.email;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const {
    _id,
    email: userEmail,
    name,
    profileImage,
    isProfileComplete,
    phone,
    location,
    ...rest
  } = user.toObject();

  return {
    id: _id,
    email: userEmail,
    name,
    profileImage,
    isProfileComplete,
    phone,
    location,
  };
};

// Refresh access token
const getNewAccessToken = async (refreshToken) => {
  const newAccessToken = createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  sendEmailOtp,
  sendPhoneOtp,
  loginWithEmail,
  loginWithPhone,
  getMe,
  getNewAccessToken,
};