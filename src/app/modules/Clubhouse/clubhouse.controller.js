import { fileUploader } from "../../helpers/fileUpload.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { postServices } from "./clubhouse.service.js";

/* ================= CREATE POST ================= */
const createPost = catchAsync(async (req, res) => {
  req.user = { id: "69881c8f04c3ff643148c27c" }; // testing user

  // 1️⃣ Parse JSON from 'data' field
  let postData = {};
  if (req.body.data) {
    try {
      postData = JSON.parse(req.body.data);
    } catch (err) {
      throw new Error("Invalid JSON in 'data' field");
    }
  }

  // 2️⃣ Upload files to Cloudinary if any
  const uploadedMedia = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      if (uploadResult) {
        uploadedMedia.push({
          url: uploadResult.secure_url,
          type: file.mimetype.startsWith("video/") ? "video" : "image",
        });
      }
    }
  }

  if (uploadedMedia.length > 0) {
    postData.media = uploadedMedia;
  }

  // 3️⃣ Create post
  const result = await postServices.createPostService(postData, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Post created successfully!",
    data: result,
  });
});
/* ================= HOME FEED ================= */
const getHomeFeed = catchAsync(async (req, res) => {
  const result = await postServices.getHomeFeedService(
    req.user,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Home feed fetched successfully!",
    data: result,
  });
});

/* ================= LIKE POST ================= */
const likePost = catchAsync(async (req, res) => {
  const result = await postServices.likePostService(
    req.user,
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Post liked successfully!",
    data: result,
  });
});

export const commentPost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;

  const result = await postServices.commentPostService(req.user, postId, text);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment added successfully!",
    data: result,
  });
});

/* ================= SEND GIFT ================= */
const sendGift = catchAsync(async (req, res) => {
  const result = await postServices.sendGiftService(
    req.user,
    req.params.id,
    req.body.giftType
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Gift sent successfully!",
    data: result,
  });
});

export const postController={
    createPost,
    getHomeFeed,
    likePost,
    sendGift,
    commentPost


}