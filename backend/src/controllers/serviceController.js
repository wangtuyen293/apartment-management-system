import ServiceCategory from '../models/ServiceCategory.js';
import ServiceOrder from '../models/ServiceOrder.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Apartment from '../models/Apartment.js';
import Bill from '../models/Bill.js';

// ========================== CRUD: ServiceCategory ==========================

// Lấy danh sách tất cả danh mục dịch vụ
const getAllServiceCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service categories", error: error.message });
    }
};

// Lấy thông tin danh mục dịch vụ theo ID
const getServiceCategoryById = async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Service category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service category", error: error.message });
    }
};

// Tạo danh mục dịch vụ mới
const createServiceCategory = async (req, res) => {
    try {
        const { name, description, price_quotation } = req.body;
        const newCategory = new ServiceCategory({ name, description, price_quotation });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error creating service category", error: error.message });
    }
};

// Cập nhật danh mục dịch vụ
const updateServiceCategory = async (req, res) => {
    try {
        const updatedCategory = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: "Service category not found" });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Error updating service category", error: error.message });
    }
};

// Xóa danh mục dịch vụ
const deleteServiceCategory = async (req, res) => {
    try {
        await ServiceCategory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Service category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service category", error: error.message });
    }
};

// ========================== CRUD: ServiceOrder ==========================

// Lấy danh sách tất cả đơn đặt dịch vụ
const getAllServiceOrders = async (req, res) => {
    try {
        const orders = await ServiceOrder.find().populate("service_category_id");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service orders", error: error.message });
    }
};

// Tạo đơn đặt dịch vụ mới
const createServiceOrder = async (req, res) => {
    try {
        const { service_category_id, amount } = req.body;
        const newOrder = new ServiceOrder({ service_category_id, amount });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating service order", error: error.message });
    }
};

// Xóa đơn đặt dịch vụ
const deleteServiceOrder = async (req, res) => {
    try {
        await ServiceOrder.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Service order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service order", error: error.message });
    }
};

// ========================== CRUD: ServiceRequest ==========================

// Lấy danh sách tất cả yêu cầu dịch vụ
const getAllServiceRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find().populate("service_category_id user_id apartment_id");
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service requests", error: error.message });
    }
};

// Tạo yêu cầu dịch vụ mới
const createServiceRequest = async (req, res) => {
    try {
        const { service_category_id, user_id, apartment_id, status, note, requested_date } = req.body;
        console.log(req.body);
        const newRequest = new ServiceRequest({ service_category_id, user_id, apartment_id, status, note, requested_date });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: "Error creating service request", error: error.message });
    }
};

// Cập nhật trạng thái yêu cầu dịch vụ
const updateServiceRequest = async (req, res) => {
    try {
        const { status, service_category_id, user_id, apartment_id } = req.body;
        const service = await ServiceCategory.findById(service_category_id);
        if (!service) {
            res.status(404).json({ message: "Service not found" });
        }
        const date = new Date();
        if (status === "Completed") {
            const bill = new Bill({
                typeOfPaid: "Service",
                fee: service.price_quotation,
                billing_date: date,
                status: "Unpaid",
                apartment_id: apartment_id,
                user_id: user_id
            })
            console.log(bill);
            await bill.save();
        }
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRequest) return res.status(404).json({ message: "Service request not found" });
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: "Error updating service request", error: error.message });
    }
};

// Xóa yêu cầu dịch vụ
const deleteServiceRequest = async (req, res) => {
    try {
        await ServiceRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Service request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service request", error: error.message });
    }
};

// ========================== Thêm/Xóa ServiceOrder vào Apartment ==========================

// Thêm ServiceOrder vào Apartment
const addServiceOrderToApartment = async (req, res) => {
    try {
        const { apartment_id } = req.body;

        const apartment = await Apartment.findById(apartment_id);
        if (!apartment) return res.status(404).json({ message: "Apartment not found" });

        apartment.services.push(req.params.id);
        await apartment.save();

        res.status(200).json({ message: "Service order added to apartment successfully", apartment });
    } catch (error) {
        res.status(500).json({ message: "Error adding service order to apartment", error: error.message });
    }
};

// Xóa ServiceOrder khỏi Apartment
const removeServiceOrderFromApartment = async (req, res) => {
    try {
        const { apartment_id } = req.body;

        const apartment = await Apartment.findById(apartment_id);
        if (!apartment) return res.status(404).json({ message: "Apartment not found" });

        apartment.services = apartment.services.filter(id => id.toString() !== req.params.id);
        await apartment.save();

        res.status(200).json({ message: "Service order removed from apartment successfully", apartment });
    } catch (error) {
        res.status(500).json({ message: "Error removing service order from apartment", error: error.message });
    }
};

export {
    getAllServiceCategories,
    getServiceCategoryById,
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
};
