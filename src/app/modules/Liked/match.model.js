import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessageAt: Date,
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One match per pair
MatchSchema.index({ users: 1 }, { unique: true });
const Match=mongoose.model("Match", MatchSchema);
export default Match;
