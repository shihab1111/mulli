import dotenv from "dotenv";

dotenv.config();
const loadEnvVariables = () => {
  const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "SESSION_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
    "REDIS_HOST",
    "REDIS_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_HOST",
    "SMTP_HOST_PORT"

  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`Missing required environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DB_URL: process.env.DB_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SMTP_USER : process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_HOST_PORT: Number(process.env.SMTP_HOST_PORT),

    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.WEBHOOK_SECRET,
    },

  };
};

const envVars = loadEnvVariables();
export { envVars };
