import express from "express";
import { changePassword, getUserProfile, updateUserProfile } from "../controllers/usersController.js";

const router = express.Router();

router.put("/me/change-password", changePassword);
router.get("/me", getUserProfile);
router.put("/me", updateUserProfile);

export default router;
