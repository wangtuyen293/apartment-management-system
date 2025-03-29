import express from "express";
import passport from "passport";
import "dotenv/config";
import {
    forgotPassword,
    login,
    logout,
    refresh,
    register,
    resetPassword,
    verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email", verifyEmail);
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }, (err, result, info) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (!result) {
            return res.status(400).json({ message: info?.message || "Login Google failed" });
        }

        res.cookie("accessToken", result.accessToken, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: "Strict",
            path: "/",
        });

        res.cookie("refreshToken", result.refreshToken, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict",
            path: "/",
        });

        res.redirect(`${process.env.FRONTEND_URL}/home`);
    })(req, res, next);
});

export default router;
