// modules/subscription/subscription.routes.js
import express from "express";
import { createSubscription } from "./subscription.controller.js";

const router = express.Router();

router.post("/create", createSubscription)
const subscriptionRoutes = router;
export default subscriptionRoutes;

