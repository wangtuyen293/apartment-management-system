import express from 'express';
import {
    getCustomerViewApartment, getCustomerRequestRentApartment, ApproveRentApartment,
    RejectRentApartment, ApproveViewApartment, RejectViewApartment, getAllResidents, updateIndex, sendBill,
    getCustomerDeposit, getBill, getCustomerRequest
} from '../controllers/residentController.js';

const router = express.Router();

router.route('/deposit').get(getCustomerDeposit)

router.route('/view').get(getCustomerViewApartment);
router.route('/pending').get(getCustomerRequestRentApartment);
router.route('/all').get(getAllResidents);

router.route('/approve-view').post(ApproveViewApartment);
router.route('/reject-view').post(RejectViewApartment);

router.route('/approve-rent').post(ApproveRentApartment);
router.route('/reject-rent').post(RejectRentApartment);

router.route('/update-index').post(updateIndex);
router.route('/send-bill').post(sendBill);
router.route('/bill-status').get(getBill);

router.route('/customer-request').get(getCustomerRequest);

export default router;
