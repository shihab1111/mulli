import { verifyToken } from "../utils/jwt.js";
import { envVars } from "../config/env.js";
import User from "../modules/User/user.model.js";

export const checkAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token missing. Please login.",
            });
        }

        // Verify token
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);

        if (!verifiedToken || !verifiedToken.email) {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: verifiedToken.email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        // Attach user info to request
        req.user = verifiedToken;
        req.userId = user._id;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed: " + error.message,
        });
    }
};
