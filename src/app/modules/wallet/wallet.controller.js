// modules/wallet/wallet.controller.js
import { createWalletPaymentIntent, getWalletBalance } from "./wallet.service.js";

export const buyWalletCoins = async (req, res) => {
    try {
        const { pack } = req.body;

        const result = await createWalletPaymentIntent({
            userId: req.user.id,
            packKey: pack,
        });

        res.json({
            message: "Wallet purchase initiated",
            clientSecret: result.clientSecret,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const walletBalance = async (req, res) => {
    try {
        const balance = await getWalletBalance(req.user.id);
        res.json({ balance });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
