import express from 'express';
import { getApartment, getApartmentDetail } from '../controllers/apartmentController.js';

const router = express.Router();

router.route('/').get(getApartment);
router.route('/:id').get(getApartmentDetail);

export default router;
