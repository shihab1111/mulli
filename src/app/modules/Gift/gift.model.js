import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    giftType: {
      type: String, // "Rose", "GolfBall"
      required: true,
      index: true,
    },

    unitCoins: { type: Number, required: true },   // cost per item
    quantity: { type: Number, default: 1, min: 1 }, // count
    totalCoins: { type: Number, required: true },  // unitCoins * quantity

    status: {
      type: String,
      enum: ["sent"],
      default: "sent",
      index: true,
    },
  },
  { timestamps: true }
);

// history queries
GiftSchema.index({ fromUser: 1, createdAt: -1 });
GiftSchema.index({ toUser: 1, createdAt: -1 });

const Gift = mongoose.model("Gift", GiftSchema);
export default Gift;
