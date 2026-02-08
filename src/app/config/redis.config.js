import Redis from "ioredis";
import { envVars } from "./env.js";

export const redisClient = new Redis({
  host: envVars.redis.host,
  port: Number(envVars.redis.port),
  username: envVars.redis.username,
  password: envVars.redis.password,
});

redisClient.on("ready", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

/**
 * Connect Redis ONCE
 */
export const connectRedis = async () => {
  if (redisClient.status === "ready") return;

  if (redisClient.status === "end") {
    await redisClient.connect();
  }

  if (redisClient.status === "connecting") {
    await new Promise((resolve) =>
      redisClient.once("ready", resolve)
    );
  }
};
