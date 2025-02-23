import express from 'express';
import { getCustomerViewApartment } from '../controllers/residentController.js';

const router = express.Router();

router.route('/').get(getCustomerViewApartment);

export default router;
