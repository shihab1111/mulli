

import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { giftServices } from "./gift.service.js";

const sendGift = catchAsync(async (req, res) => {
  const result = await giftServices.sendGiftService(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Gift sent successfully!",
    data: result,
  });
});

const getSentGifts = catchAsync(async (req, res) => {
  const result = await giftServices.getSentGiftsService(req.user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Sent gifts fetched successfully!",
    data: result,
  });
});

const getReceivedGifts = catchAsync(async (req, res) => {
  const result = await giftServices.getReceivedGiftsService(req.user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Received gifts fetched successfully!",
    data: result,
  });
});

export const giftControllers = {
  sendGift,
  getSentGifts,
  getReceivedGifts,
};
