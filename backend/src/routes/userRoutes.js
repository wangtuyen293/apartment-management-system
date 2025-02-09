import express from "express";
import { getUser, register } from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUser);
router.post("/register", register);

export default router;
