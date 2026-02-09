// modules/subscription/subscription.model.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        subscriptionType: {
            type: String,
            enum: ["MULLI_PLUS", "MULLI_X"],
            required: true,
        },

        duration: {
            type: String,
            enum: ["WEEK", "MONTH", "YEAR"],
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "expired", "cancelled", "pending"],
            default: "pending",
            index: true,
        },

        startDate: Date,
        endDate: Date,

        // Stripe specific
        stripeCustomerId: String,
        stripeSubscriptionId: String,
        stripePriceId: String,

        amount: Number,
        currency: { type: String, default: "usd" },
    },
    { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
