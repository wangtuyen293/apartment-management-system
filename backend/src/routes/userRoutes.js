import express from "express";
import { changePassword, getUserProfile, updateUserProfile, updateUserRole } from "../controllers/usersController.js";
import { adminAuth, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/me/change-password", protect, changePassword);
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.put("/:userId/role", protect, adminAuth, updateUserRole);

export default router;
