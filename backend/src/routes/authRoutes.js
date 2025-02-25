import express from "express";
import passport from "passport";
import "dotenv/config";
import {
    login,
    refresh,
    register,
    verifyEmail,
} from "../controllers/authController.js";

const FRONTEND_URL = process.env.FRONTEND_URL;
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refresh);
router.get("/verify-email", verifyEmail);
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, result, info) => {
        if (err || !result) {
            return res.status(400).json({
                message: info?.message || "Login google failed",
            });
        }

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: "Strict",
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict",
        });

        res.json(result);
    })(req, res, next);
});

export default router;
