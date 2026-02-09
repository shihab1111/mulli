// modules/wallet/wallet.service.js
import Stripe from "stripe";

import { envVars } from "../../config/env.js";
import WalletTransaction from "./wallet.model.js";

const stripe = new Stripe(envVars.stripe.secretKey);
// config/walletPacks.js
const WALLET_PACKS = {
    SMALL: { coins: 100, amount: 199 },   // $1.99
    MEDIUM: { coins: 500, amount: 799 },  // $7.99
    LARGE: { coins: 1200, amount: 1499 }, // $14.99
};

// Create Stripe PaymentIntent for buying coins
export const createWalletPaymentIntent = async ({ userId, packKey }) => {
    const pack = WALLET_PACKS[packKey];
    if (!pack) throw new Error("Invalid wallet pack");

    const intent = await stripe.paymentIntents.create({
        amount: pack.amount,
        currency: "usd",
        metadata: {
            userId,
            coins: pack.coins,
            type: "WALLET_CREDIT",
        },
    });

    return { clientSecret: intent.client_secret };
};

// Handle Stripe webhook for coin purchases
export const handleWalletWebhook = async (event) => {
    if (event.type !== "payment_intent.succeeded") return;

    const intent = event.data.object;
    if (intent.metadata.type !== "WALLET_CREDIT") return;

    const userId = intent.metadata.userId;
    const coins = Number(intent.metadata.coins);

    await WalletTransaction.create({
        userId,
        amount: coins,
        type: "credit",
        reason: "coin_purchase",
        stripePaymentIntentId: intent.id,
    });
};

// Compute current balance dynamically
export const getWalletBalance = async (userId) => {
    const result = await WalletTransaction.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: "$userId", balance: { $sum: "$amount" } } },
    ]);

    return result[0]?.balance || 0;
};
