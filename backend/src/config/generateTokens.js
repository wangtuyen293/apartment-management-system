import RefreshToken from "../models/refreshToken.js";

const generateTokens = async (user) => {
    const payload = { email: user.email };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
};

export default generateTokens;
