import express from 'express';
import { getApartment, getApartmentDetail, requestForViewApartment, requestForRentApartment, addApartment, updateApartment, deleteApartment, extendContract, removeContract } from '../controllers/apartmentController.js';

const router = express.Router();

router.route('/').get(getApartment);
router.route('/:id').get(getApartmentDetail);
router.route('/view/:id/:userid').post(requestForViewApartment);
router.route('/rent/:id/:userid').post(requestForRentApartment);
router.route('/add').post(addApartment);
router.route('/update/:id').put(updateApartment);
router.route('/delete/:id').delete(deleteApartment);
router.route('/contract/:id').put(extendContract);
router.route('/contract-remove/:id').put(removeContract);

export default router;
