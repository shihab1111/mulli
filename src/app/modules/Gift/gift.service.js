import mongoose from "mongoose";

import Gift from "./gift.model.js";
import User from "../User/user.model.js";
import AppError from "../../errorHelpers/AppError.js";


// ✅ Server-side gift coin cost (do not trust client price)
const GIFT_COIN_COST = {
  Rose: 10,
  GolfBall: 25,
  Teddy: 50,
};

const sendGiftService = async (user, payload) => {
//   const fromUserId = user.id || user._id; // depends on your auth middleware
  const fromUserId = "698766aeb4a9609dd15df121"; // depends on your auth middleware
  const { toUserId, giftType, quantity = 1 } = payload;

  if (!toUserId || !giftType) {
    throw new AppError(400, "toUserId and giftType are required");
  }

  if (String(fromUserId) === String(toUserId)) {
    throw new AppError(400, "You cannot send gift to yourself");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError(400, "quantity must be a positive integer");
  }

  const unitCoins = GIFT_COIN_COST[giftType];
  if (!unitCoins) {
    throw new AppError(400, "Invalid giftType");
  }

  const totalCoins = unitCoins * quantity;

  const session = await mongoose.startSession();
  let result = null;

  try {
    await session.withTransaction(async () => {
      // 1) receiver must exist
      const receiver = await User.findById(toUserId).select("_id").session(session);
      if (!receiver) throw new AppError(404, "Receiver not found");

      // 2) deduct sender coins atomically (prevents negative)
      const deducted = await User.updateOne(
        { _id: fromUserId, coins: { $gte: totalCoins } },
        { $inc: { coins: -totalCoins } },
        { session }
      );

      if (deducted.modifiedCount === 0) {
        throw new AppError(400, "Not enough coins");
      }

      // 3) add coins to receiver
      await User.updateOne(
        { _id: toUserId },
        { $inc: { coins: totalCoins } },
        { session }
      );

      // 4) create gift history record
      const created = await Gift.create(
        [
          {
            fromUser: fromUserId,
            toUser: toUserId,
            giftType,
            unitCoins,
            quantity,
            totalCoins,
            status: "sent",
          },
        ],
        { session }
      );

      // 5) return updated balances
      const senderAfter = await User.findById(fromUserId).select("coins").session(session);
      const receiverAfter = await User.findById(toUserId).select("coins").session(session);

      result = {
        gift: created[0],
        transferredCoins: totalCoins,
        senderCoins: senderAfter?.coins ?? 0,
        receiverCoins: receiverAfter?.coins ?? 0,
      };
    });

    return result;
  } finally {
    session.endSession();
  }
};

const getSentGiftsService = async (user) => {
  const userId = user.id || user._id;

  const gifts = await Gift.find({ fromUser: userId })
    .populate("toUser", "name profileImage coins location")
    .sort({ createdAt: -1 });

  return gifts;
};

const getReceivedGiftsService = async (user) => {
  const userId = user.id || user._id;

  const gifts = await Gift.find({ toUser: userId })
    .populate("fromUser", "name profileImage coins location")
    .sort({ createdAt: -1 });

  return gifts;
};

export const giftServices = {
  sendGiftService,
  getSentGiftsService,
  getReceivedGiftsService,
};
