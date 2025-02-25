import express from "express";
import passport from "passport";
import "dotenv/config";
import {
    login,
    logout,
    refresh,
    register,
    verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refresh);
router.get("/auth/verify-email", verifyEmail);
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, result, info) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (!result) {
            return res.status(400).json({ message: info?.message || "Login Google failed" });
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
