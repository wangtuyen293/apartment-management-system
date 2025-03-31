import Apartment from '../models/Apartment.js';
import User from '../models/User.js';
import CustomerRequest from '../models/CustomerRequest.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)!'));
    },
}).array('images', 4);

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

const addApartment = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {

            const images = req.files ? req.files.map(file => ({
                url: `/uploads/${file.filename}`,
            })) : [];

            const apartmentData = {
                apartmentNumber: req.body.apartmentNumber,
                description: req.body.description,
                floor: req.body.floor,
                area: req.body.area,
                price: req.body.price,
                status: 'Trống',
                images: images,
            };

            const apartment = new Apartment(apartmentData);
            await apartment.save();

            res.status(201).json(apartment);
        } catch (error) {
            console.error('Error adding apartment:', error);
            res.status(500).json({
                message: 'Error adding apartment',
                error: error.message
            });
        }
    });
};

const updateApartment = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const apartmentId = req.params.id;
            console.log('Apartment ID:', apartmentId);
            const { apartmentNumber, description, floor, area, price } = req.body;
            const images = req.files ? req.files.map(file => ({
                url: `/uploads/${file.filename}`,
            })) : [];
            const existingApartment = await Apartment.findById(apartmentId);
            if (!existingApartment) {
                return res.status(404).json({ message: "Căn hộ không tồn tại" });
            }

            const apartmentData = await Apartment.findByIdAndUpdate(
                apartmentId,
                {
                    apartmentNumber,
                    description,
                    floor,
                    area,
                    price,
                    images,
                },
                { new: true }
            );

            if (!apartmentData) {
                return res.status(500).json({ message: "Không thể cập nhật căn hộ" });
            }

            res.status(200).json(apartmentData);
        } catch (error) {
            console.error('Error updating apartment:', error);
            if (error.code === 11000) {
                return res.status(400).json({
                    message: `Căn hộ với số "${req.body.apartmentNumber}" đã tồn tại`,
                });
            }
            res.status(500).json({
                message: 'Error updating apartment',
                error: error.message,
            });
        }
    });
};

const deleteApartment = async (req, res) => {
    try {
        const apartmentId = req.params.id;
        const request = await CustomerRequest.find({ apartment_id: apartmentId });
        console.log('Request:', request);
        request.forEach(async (item) => {
            await CustomerRequest.findByIdAndDelete(item._id);
        }
        );
        const apartment = await Apartment.findByIdAndDelete(apartmentId);
        if (!apartment) {
            return res.status(404).json({ message: "Căn hộ không tồn tại" });
        }
        res.status(200).json({ message: "Căn hộ đã được xóa thành công" });
    } catch (error) {
        console.error('Error deleting apartment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const extendContract = async (req, res) => {
    try {
        const apartmentId = req.params.id;
        console.log('Apartment ID:', apartmentId);
        const { startDate, endDate } = req.body;
        const apartment = await Apartment.findByIdAndUpdate(
            apartmentId,
            {
                $set: {
                    startRentDate: startDate,
                    endRentDate: endDate,
                },
            },
            { new: true }
        )
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        res.status(200).json({ message: "Contract extended successfully", apartment });
    } catch (error) {
        console.error('Error extending contract:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const removeContract = async (req, res) => {
    try {
        const apartmentId = req.params.id;
        const apartment = await Apartment.findByIdAndUpdate(
            apartmentId,
            {
                $set: {
                    startRentDate: null,
                    endRentDate: null,
                    status: 'Trống',
                    tenantId: null,
                    services: [],
                },
            },
            { new: true }
        );
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        res.status(200).json({ message: "Contract removed successfully", apartment });
    } catch (error) {
        console.error('Error removing contract:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const userExtendContract = async (req, res) => {
    try {
        const { payload } = req.body;
        const apartment = await Apartment.findById(payload.id).populate('tenantId');
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        const request = new CustomerRequest({
            apartment_id: apartment._id,
            status: "Gia hạn hợp đồng",
            userId: apartment.tenantId._id,
            date: payload.extendDate,
            contractMonths: payload.extendDuration,
        })
        await request.save();
        res.status(200).json({ message: "Request for contract extension sent successfully" });
    } catch (error) {
        console.error('Error extending contract:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const terminateContract = async (req, res) => {
    try {
        const { payload } = req.body;
        console.log('Payload:', payload);
        const apartment = await Apartment.findById(payload.id).populate('tenantId');
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }
        const request = new CustomerRequest({
            apartment_id: apartment._id,
            status: "Chấm dứt hợp đồng",
            userId: apartment.tenantId._id
        })
        await request.save();
        res.status(200).json({ message: "Request for contract extension sent successfully" });
    } catch (error) {
        console.error('Error extending contract:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export {
    getApartment, getApartmentDetail, requestForViewApartment, requestForRentApartment, addApartment,
    updateApartment, deleteApartment, extendContract, removeContract, userExtendContract, terminateContract,
};
