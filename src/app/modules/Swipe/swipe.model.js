import mongoose from "mongoose";

const SwipeSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["like", "pass"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate swipes
SwipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Swipe=mongoose.model("Swipe", SwipeSchema);
export default Swipe;