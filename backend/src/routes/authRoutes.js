import express from "express";
import passport from "passport";
import "dotenv/config";
import { login, register, verifyEmail } from "../controllers/authController.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
// router.post("/refresh", refresh);
router.get('/verify-email', verifyEmail);
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const { user, token } = req.user;
        res.redirect(
            `${FRONTEND_URL}/login?token=${token}&user=${JSON.stringify(
                user
            )}`
        );
    }
);

export default router;
