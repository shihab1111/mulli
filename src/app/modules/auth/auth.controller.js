// modules/auth/auth.controller.js
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AuthServices } from "./auth.service.js";
import { setAuthCookie } from "../../utils/SetCookie.js";

// Send OTP to Email
const sendEmailOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Email is required",
    });
  }

  const result = await AuthServices.sendEmailOtp(email);

  if (!result.success) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: result.message,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email",
    data: result.data,
  });
});

// Send OTP to Phone
const sendPhoneOtp = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Phone number is required",
    });
  }

  const result = await AuthServices.sendPhoneOtp(phoneNumber);

  if (!result.success) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: result.message,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your phone",
    data: result.data,
  });
});

// Login with Email OTP
const loginWithEmail = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Email and OTP required",
    });
  }

  const result = await AuthServices.loginWithEmail(email, otp);

  if (!result.success) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: result.message,
    });
  }

  // Set auth cookies
  setAuthCookie(res, {
    accessToken: result.data.accessToken,
    refreshToken: result.data.refreshToken,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.data,
  });
});

// Login with Phone OTP
const loginWithPhone = catchAsync(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Phone number and OTP required",
    });
  }

  const result = await AuthServices.loginWithPhone(phoneNumber, otp);

  if (!result.success) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: result.message,
    });
  }

  // Set auth cookies
  setAuthCookie(res, {
    accessToken: result.data.accessToken,
    refreshToken: result.data.refreshToken,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.data,
  });
});

// Get current user
const getMe = catchAsync(async (req, res) => {
  const userSession = req.cookies;
  const result = await AuthServices.getMe(userSession);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// Logout
const logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged out successfully",
    data: null,
  });
});

// Refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Refresh token missing",
    });
  }

  const result = await AuthServices.getNewAccessToken(refreshToken);

  // Set new access token cookie
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: result,
  });
});

export const AuthControllers = {
  sendEmailOtp,
  sendPhoneOtp,
  loginWithEmail,
  loginWithPhone,
  getMe,
  logout,
  refreshToken,
};