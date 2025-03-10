import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/User.js";
import { generateAccessToken, generateToken } from "../config/generateToken.js";
import RefreshToken from "../models/RefreshToken.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password is required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Username or password is incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Username or password is incorrect" });
        }

        if (!user.isActive) {
            return res
                .status(400)
                .json({ message: "User account is inactive." });
        }

        if (!user.isVerified) {
            return res
                .status(400)
                .json({ message: "Email has not been verified." });
        }

        const { accessToken, refreshToken } = await generateToken(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: "Strict",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict",
        });

        res.status(200).json({
            user: { id: user._id, email: user.email, username: user.username, role: user.role },
        });
    } catch (error) {
        console.log(error);
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
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            name,
            gender: gender || "Other",
            address: address || "",
            phoneNumber: phoneNumber || "",
        });

        const emailVerificationToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        newUser.emailVerificationToken = emailVerificationToken;
        newUser.emailVerificationExpires = Date.now() + 60 * 60 * 1000;

        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: "Email Verification",
            text: `Please verify your email by clicking the following link: ${verificationLink} or verify by OTP ${emailVerificationToken}`,
            html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p>`,
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
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: "Strict",
        });

        res.status(200).json({ accessToken, refreshToken: refresh });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            email: decoded.email,
            emailVerificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Token is invalid or has expired" });
        }

        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
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
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
