import Apartment from '../models/apartments.js';
import User from '../models/users.js';

const getCustomerViewApartment = async (req, res) => {
    try {

        const apartments = await Apartment.find({ status: "Khách hẹn xem" });

        if (!apartments || apartments.length === 0) {
            return res.status(404).json({ message: "Apartment not found" });
        }

        const apartmentWithUser = [];
        for (let apartment of apartments) {
            const user = await User.findById(apartment.user_id);
            if (user) {
                apartmentWithUser.push({
                    user
                });
            }
        }

        // Send the response with the apartment and user data
        return res.status(200).json(apartmentWithUser);

    } catch (error) {
        // Log the error and return a 500 response
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export { getCustomerViewApartment };