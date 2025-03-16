import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        phoneNumber: user.phoneNumber,
        name: user.name,
        address: user.address,
        gender: user.gender,
    };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
};

export const generateRefreshToken = async (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        phoneNumber: user.phoneNumber,
        name: user.name,
        address: user.address,
        gender: user.gender,
    };
    let refreshToken;
    let tokenExists = true;

    while (tokenExists) {
        const randomString = crypto.randomBytes(64).toString("hex");
        const refreshTokenPayload = { ...payload, random: randomString };

        refreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "1d",
            }
        );

        tokenExists = await RefreshToken.findOne({ token: refreshToken });
    }

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return refreshToken;
};

export const generateToken = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { accessToken, refreshToken };
};
