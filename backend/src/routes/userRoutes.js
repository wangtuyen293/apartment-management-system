import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/usersController.js";

const router = express.Router();

router.get("/me", getUserProfile);
router.put("/me", updateUserProfile);

export default router;
