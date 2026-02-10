import { verifyToken } from "../utils/jwt.js";
import { envVars } from "../config/env.js";
import User from "../modules/User/user.model.js";

export const checkAuth = (...allowedRoles) => {
    return async (req, res, next) => {
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

            if (!verifiedToken || (!verifiedToken.email && !verifiedToken.phone)) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token.",
                });
            }

            // Check if user exists by email OR phone
            const user = await User.findOne({
                $or: [
                    { email: verifiedToken.email || "" },
                    { phone: verifiedToken.phone || "" }
                ]
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found.",
                });
            }

            // Check role if any roles are specified
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Insufficient permissions.",
                });
            }

            // Attach user info to request
            req.user = {
                id: user._id,
                email: user.email || "",
                phone: user.phone || "",
                role: user.role,
                name: user.firstName || "",
            };

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed: " + error.message,
            });
        }
    };
};