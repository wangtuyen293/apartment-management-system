import express from 'express';
import { depositContract } from "../controllers/contractController.js";

const router = express.Router();

router.route('/deposit').post(depositContract);


export default router;
