import express from 'express';
import { getCustomerViewApartment, getCustomerRequestRentApartment, ApproveRentApartment, RejectRentApartment } from '../controllers/residentController.js';

const router = express.Router();

router.route('/view').get(getCustomerViewApartment);
router.route('/pending').get(getCustomerRequestRentApartment);
router.route('/approve').post(ApproveRentApartment);
router.route('/reject').post(RejectRentApartment);

export default router;
