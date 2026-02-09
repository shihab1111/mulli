// modules/subscription/subscription.service.js
import Stripe from "stripe";
import { STRIPE_PRICES } from "../../config/stripePrices.js";
import Subscription from "./subscription.model.js";
import { envVars } from "../../config/env.js";


const stripe = new Stripe(envVars.stripe.secretKey);

/* ===========================
   CREATE SUBSCRIPTION
=========================== */
export const createStripeSubscription = async ({
    userId,
    email,
    subscriptionType,
    duration,
}) => {
    const priceId = STRIPE_PRICES[subscriptionType]?.[duration];
    if (!priceId) throw new Error("Invalid subscription plan");

    const customer = await stripe.customers.create({
        email,
        metadata: { userId },
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
    });

    await Subscription.create({
        userId,
        subscriptionType,
        duration,
        status: "pending",
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        amount: subscription.items.data[0].price.unit_amount,
        currency: subscription.items.data[0].price.currency,
    });

    return {
        clientSecret:
            subscription.latest_invoice.payment_intent.client_secret,
    };
};

/* ===========================
   STRIPE WEBHOOK HANDLER
=========================== */
export const handleStripeWebhook = async (req) => {
    const sig = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        envVars.stripe.webhookSecret
    );

    switch (event.type) {
        case "invoice.payment_succeeded": {
            const stripeSubId = event.data.object.subscription;

            const sub = await Subscription.findOne({
                stripeSubscriptionId: stripeSubId,
            });

            if (!sub) break;

            const startDate = new Date();
            const endDate = new Date(startDate);

            if (sub.duration === "WEEK") endDate.setDate(endDate.getDate() + 7);
            if (sub.duration === "MONTH") endDate.setMonth(endDate.getMonth() + 1);
            if (sub.duration === "YEAR") endDate.setFullYear(endDate.getFullYear() + 1);

            sub.status = "active";
            sub.startDate = startDate;
            sub.endDate = endDate;
            await sub.save();

            break;
        }

        case "customer.subscription.deleted": {
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: event.data.object.id },
                { status: "cancelled" }
            );
            break;
        }

        default:
            break;
    }

    return { received: true };
};
