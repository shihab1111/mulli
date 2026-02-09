// modules/wallet/walletTransaction.model.js
import mongoose from "mongoose";

const walletTxnSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        amount: Number, // +100 or -5
        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
        },

        reason: {
            type: String,
            enum: ["coin_purchase", "super_like", "boost", "priority_like", "refund"],
            required: true,
        },

        stripePaymentIntentId: String, // for purchases
    },
    { timestamps: true }
);

const WalletTransaction = mongoose.model("WalletTransaction", walletTxnSchema);
export default WalletTransaction;
