import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/User.js";
import { generateAccessToken, generateToken } from "../utils/generateToken.js";
import RefreshToken from "../models/RefreshToken.js";

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Username or password is incorrect" });
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Username or password is incorrect" });
        }

        if (!user.isActive) {
            return res
                .status(400)
                .json({ message: "Account is inactive. Please contact support." });
        }

        if (!user.isVerified) {
            return res
                .status(400)
                .json({ message: "Please verify your email before logging in." });
        }

        const { accessToken, refreshToken } = await generateToken(user);

        res.cookie("accessToken", accessToken, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: "Strict",
            path: "/",
        });

        res.cookie("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict",
            path: "/",
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                phoneNumber: user.phoneNumber,
                name: user.name,
                address: user.address,
                gender: user.gender,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            name,
            gender,
            address,
            phoneNumber,
        } = req.body;

        if (!username || !email || !password || !name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    message: "Password must be at least 8 characters long",
                });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const emailVerificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            name,
            gender: gender || "Other",
            address: address || "",
            phoneNumber: phoneNumber || "",
            emailVerificationOTP,
            emailVerificationOTPExpires: Date.now() + 5 * 60 * 1000,
        });

        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: "Email Verification",
            text: `Please verify your email by clicking the following link: ${verificationLink} and use the OTP to verify: ${emailVerificationOTP}`,
            html: `
                <p>Please verify your email by clicking the following link:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p>And use the OTP to verify: <strong>${emailVerificationOTP}</strong></p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message:
                "User registered successfully. Please check your email to verify your account.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refresh } = req.body;

        if (!refresh) {
            return res
                .status(400)
                .json({ message: "Refresh token is required" });
        }

        const existingToken = await RefreshToken.findOne({
            token: refresh,
        });

        if (!existingToken || existingToken.expiresAt < new Date()) {
            return res
                .status(403)
                .json({ message: "Refresh token is invalid or expired" });
        }

        let decoded;

        try {
            decoded = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res
                .status(403)
                .json({ message: "Refresh token is invalid or expired" });
        }

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = generateAccessToken(user);

        res.cookie("accessToken", accessToken, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: "Strict",
            path: "/",
        });

        res.status(200).json({ accessToken, refreshToken: refresh });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({
            email,
            emailVerificationOTP: otp,
            emailVerificationOTPExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.emailVerificationOTP = null;
        user.emailVerificationOTPExpires = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await RefreshToken.findOneAndDelete({ token: refreshToken });
        }

        res.clearCookie("accessToken", {
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
