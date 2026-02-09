// modules/subscription/subscription.controller.js
import {
    createStripeSubscription,
    handleStripeWebhook,
} from "./subscription.service.js";

export const createSubscription = async (req, res) => {
    try {
        const { subscriptionType, duration } = req.body;

        const result = await createStripeSubscription({
            userId: req.user.id,
            email: req.user.email,
            subscriptionType,
            duration,
        });

        res.json({
            message: "Subscription initiated",
            clientSecret: result.clientSecret,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const stripeWebhookController = async (req, res) => {
    try {
        await handleStripeWebhook(req);
        res.json({ received: true });
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
