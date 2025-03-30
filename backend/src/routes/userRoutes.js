import express from "express";
import { changePassword, getUserProfile, updateUserProfile, updateUserRole, uploadAvatar } from "../controllers/usersController.js";
import { adminAuth, protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.put("/me/change-password", protect, changePassword);
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.put("/:userId/role", protect, adminAuth, updateUserRole);
router.post("/me/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
