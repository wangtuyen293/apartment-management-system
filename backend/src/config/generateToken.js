import RefreshToken from "../models/refreshToken.js";
import jwt from "jsonwebtoken";

const generateToken = async (user) => {
    const payload = { email: user.email, user: user };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
};

export default generateToken;
