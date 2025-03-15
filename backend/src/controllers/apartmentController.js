import Apartment from '../models/Apartment.js';
import User from '../models/User.js';
import CustomerRequest from '../models/CustomerRequest.js';

const getApartment = async (req, res) => {
    try {
        const apartments = await Apartment.find().populate('tenantId');
        res.json(apartments);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getApartmentDetail = async (req, res) => {
    try {
        const apartment = await Apartment.findById(req.params.id);
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        res.json(apartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const requestForViewApartment = async (req, res) => {
    try {
        const { date } = req.body;
        const apartment = await Apartment.findById(req.params.id);
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }

        const user = await User.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedApartment = await Apartment.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    status: "Khách hẹn xem",
                },
            }
        );

        const viewRequest = new CustomerRequest({
            apartment_id: apartment._id,
            status: "Khách hẹn xem",
            userId: user._id,
            date: date,
        });
        await viewRequest.save();

        if (updatedApartment.modifiedCount === 0) {
            return res.status(400).json({ message: "Failed to update apartment" });
        }

        return res.status(200).json({ message: "Apartment status updated successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const requestForRentApartment = async (req, res) => {
    try {
        const { date, contractMonths } = req.body;

        const apartment = await Apartment.findById(req.params.id);
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }

        const user = await User.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedApartment = await Apartment.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    status: "Đang xét duyệt",
                }
            }
        );

        const viewRequest = new CustomerRequest({
            apartment_id: apartment._id,
            status: "Đang xét duyệt",
            userId: user._id,
            date: date,
            contractMonths: contractMonths,
        });
        await viewRequest.save();

        if (updatedApartment.modifiedCount === 0) {
            return res.status(400).json({ message: "Failed to update apartment" });
        }

        return res.status(200).json({ message: "Apartment status updated successfully" });

    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export { getApartment, getApartmentDetail, requestForViewApartment, requestForRentApartment };
