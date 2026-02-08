import mongoose from "mongoose";
import { envVars } from "./env.js";

const connectDB = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
