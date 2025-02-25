import express from "express";
import { getUserProfile } from "../controllers/usersController.js";

const router = express.Router();

router.get("/me", getUserProfile);

export default router;
