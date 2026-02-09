import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressSession from "express-session";
import { RedisStore } from "connect-redis";
import router from "./app/routes/index.js";
import { redisClient } from "./app/config/redis.config.js";
import { globalErrorHandler } from "./app/middlewars/globalErrorHandler.js";
import notFound from "./app/middlewars/notFound.js";
import { envVars } from "./app/config/env.js";
import { stripeWebhookController as stripeWebhook } from "./app/modules/subscription/subscription.controller.js";

const app = express();

// Core middlewares
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);

// Session store
app.use(
    expressSession({
        store: new RedisStore({ client: redisClient }),
        secret: envVars.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Passport


// Routes
app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Project is running successfully" });
});

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;
