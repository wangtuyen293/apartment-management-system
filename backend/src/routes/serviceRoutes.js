import express from "express";
import {
    getAllServiceCategories,
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    getAllServiceOrders,
    createServiceOrder,
    deleteServiceOrder,
    getAllServiceRequests,
    createServiceRequest,
    updateServiceRequest,
    deleteServiceRequest,
    addServiceOrderToApartment,
    removeServiceOrderFromApartment
} from "../controllers/serviceController.js";

const router = express.Router();

// ========================== Routes cho ServiceCategory ==========================
router.route("/categories").get(getAllServiceCategories).post(createServiceCategory);
router.route("/categories/:id").put(updateServiceCategory).delete(deleteServiceCategory);

// ========================== Routes cho ServiceOrder ==========================
router.route("/orders").get(getAllServiceOrders).post(createServiceOrder);
router.route("/orders/:id").delete(deleteServiceOrder);

// ========================== Routes cho ServiceRequest ==========================
router.route("/requests").get(getAllServiceRequests).post(createServiceRequest);
router.route("/requests/:id").put(updateServiceRequest).delete(deleteServiceRequest);

// ========================== Routes để thêm/xóa ServiceOrder vào Apartment ==========================
router.route("/apartments/add/:id").post(addServiceOrderToApartment);
router.route("/apartments/remove/:id").post(removeServiceOrderFromApartment);

export default router;
