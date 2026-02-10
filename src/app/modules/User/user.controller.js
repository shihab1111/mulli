import { fileUploader } from "../../helpers/fileUpload.js";
import { sendResponse } from "../../utils/sendResponse.js";
import * as userService from "./user.service.js";
import User from "./user.model.js";


const createUser = async (req, res) => {
  try {
    let bodyData = {};
    if (req.body.data) {
      bodyData = JSON.parse(req.body.data);
    } else {
      bodyData = req.body;
    }

    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map((f) => fileUploader.uploadToCloudinary(f))
      );
      const urls = uploadResults.map((r) => r?.secure_url).filter(Boolean);
      bodyData.images = urls;
      bodyData.profileImage = urls[0]; 
    }

    const userData = await userService.createUser(bodyData);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Parsing or Upload Error: " + err.message,
    });
  }
};

const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email required",
      });
    }
   const checkUser=await User.findOne({email});
   if(checkUser && checkUser.isProfileComplete && checkUser.isEmailVerified){
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Account already exists with this email. Please login.",
    });
   }
   const otp = await userService.createSignUpEmailOtp(email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP sent",
      data: { otp }, // optional: include OTP for testing
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
    });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email and OTP required",
      });
    }

    const result = await userService.verifyEmailOtp(email, otp);

    sendResponse(res, {
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data || null,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
    });
  }
};

const sendPhoneOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Phone required",
      });
    }

    const result = await userService.createPhoneOtp(phoneNumber);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
    });
  }
};

const verifyPhoneOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Phone and OTP required",
      });
    }

    const result = await userService.verifyPhoneOtp(phoneNumber, otp);

    sendResponse(res, {
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err.message,
    });
  }
};

export const userControllers = {
  createUser,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
};
