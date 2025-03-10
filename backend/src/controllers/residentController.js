import Apartment from '../models/Apartments.js';
import User from '../models/User.js';
import CustomerRequest from '../models/CustomerRequest.js';

const getCustomerViewApartment = async (req, res) => {
    try {
        const users = await CustomerRequest.find({ status: "Khách hẹn xem" });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Users not found" });
        }

        const customerView = [];

        for (const user of users) {
            const username = await User.findById(user.user_id);
            const apartment = await Apartment.findById(user.apartment_id);

            customerView.push({
                _id: user._id,
                username: username ? username.name : 'Unknown',
                apartment: apartment ? apartment.apartment_number : 'Unknown',
                phoneNumber: username.phoneNumber,
                status: user.status,
                date: user.date
            });
        }

        return res.status(200).json(customerView);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const getCustomerRequestRentApartment = async (req, res) => {
    try {
        const users = await CustomerRequest.find({ status: "Đang xét duyệt" });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Users not found" });
        }

        const customerView = [];

        for (const user of users) {
            const username = await User.findById(user.user_id);
            const apartment = await Apartment.findById(user.apartment_id);

            customerView.push({
                _id: user._id,
                username: username ? username.name : 'Unknown',
                apartment: apartment ? apartment.apartment_number : 'Unknown',
                phoneNumber: username.phoneNumber,
                status: user.status,
                date: user.date,
                contractMonths: user.contractMonths,
            });
        }

        return res.status(200).json(customerView);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const ApproveRentApartment = async (req, res) => {
    try {
        const { requestId } = req.body;
        console.log(requestId)
        const request = await CustomerRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const updatedApartment = await Apartment.updateOne(
            { _id: request.apartment_id },
            {
                $set: {
                    status: "Đã cho thuê",
                    user_id: request.user_id,
                }
            }
        );

        if (updatedApartment.nModified === 0) {
            return res.status(400).json({ message: 'Apartment update failed' });
        }

        const deletedRequest = await CustomerRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(400).json({ message: 'Failed to delete the request' });
        }

        return res.status(200).json({ message: 'Apartment rented successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const RejectRentApartment = async (req, res) => {
    try {
        const { requestId } = req.body;
        const request = await CustomerRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const updatedApartment = await Apartment.updateOne(
            { _id: request.apartment_id },
            {
                $set: {
                    status: "Trống",
                }
            }
        );

        if (updatedApartment.nModified === 0) {
            return res.status(400).json({ message: 'Apartment update failed' });
        }

        const deletedRequest = await CustomerRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(400).json({ message: 'Failed to delete the request' });
        }

        return res.status(200).json({ message: 'Apartment rented successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export { getCustomerViewApartment, getCustomerRequestRentApartment, ApproveRentApartment, RejectRentApartment };