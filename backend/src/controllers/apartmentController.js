import Apartment from '../models/apartments.js';


const getApartment = async (req, res) => {
    try {
        const apartments = await Apartment.find();
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



export { getApartment, getApartmentDetail };
