import express from 'express';
import { depositContract, getContractFile, acceptDepositContract } from "../controllers/contractController.js";

const router = express.Router();

router.route('/deposit/:apartmentId').post(depositContract);
router.route('/file/:fileName').get(getContractFile);
router.route('/deposit/sign/:apartmentId').post(acceptDepositContract);


export default router;
