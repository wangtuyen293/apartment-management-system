import express from 'express';
import { depositPayment, checkPaymentStatus, getAllBill, BillPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.route('/deposit').post(depositPayment);
router.route('/save').post(checkPaymentStatus);
router.route('/pay').post(BillPayment);

router.route('/getbill').post(getAllBill);

export default router;  