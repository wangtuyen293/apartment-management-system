import express from 'express';
import { getApartment, getApartmentDetail, requestForViewApartment, requestForRentApartment, addApartment } from '../controllers/apartmentController.js';

const router = express.Router();

router.route('/').get(getApartment);
router.route('/:id').get(getApartmentDetail);
router.route('/view/:id/:userid').post(requestForViewApartment);
router.route('/rent/:id/:userid').post(requestForRentApartment);
router.route('/add').post(addApartment);

export default router;
