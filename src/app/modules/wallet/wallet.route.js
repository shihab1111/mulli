// modules/wallet/wallet.routes.js
import express from "express";
import { buyWalletCoins, walletBalance } from "./wallet.controller.js";

const router = express.Router();

router.post("/buy", buyWalletCoins);
router.get("/balance", walletBalance);

const walletRoutes = router;
export default walletRoutes;
