import { envVars } from "../config/env.js";
import { generateToken, verifyToken } from "./jwt.js";

export const createUserTokens = (user) => {
  const jwtPayload = {
  email: user.email || "",
  userId: user._id,
  role: user.role,
  name: user.name || "",
  phone: user.phone || "",
};

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES || "15m"
    );
    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRES || "7d"
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const createNewAccessTokenWithRefreshToken = (refreshToken) => {
    try {
        const verifiedRefreshToken = verifyToken(
            refreshToken,
            envVars.JWT_REFRESH_SECRET
        );

        if (!verifiedRefreshToken || !verifiedRefreshToken.email) {
            throw new Error("Invalid refresh token");
        }

        const jwtPayload = {
            userId: verifiedRefreshToken.userId,
            email: verifiedRefreshToken.email,
        };

        const accessToken = generateToken(
            jwtPayload,
            envVars.JWT_ACCESS_SECRET,
            envVars.JWT_ACCESS_EXPIRES || "15m"
        );

        return accessToken;
    } catch (error) {
        throw new Error("Failed to refresh access token: " + error.message);
    }
};