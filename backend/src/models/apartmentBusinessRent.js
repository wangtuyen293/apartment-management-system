import mongoose from "mongoose";

const apartmentBusinessRentSchema = new mongoose.Schema(
    {
        business_type: {
            type: String,
            required: true,
        },
        rent_amount: {
            type: Number,
            required: true,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
        },
        apartment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
            required: true,
        },
    },
    { timestamps: true }
);

const ApartmentBusinessRent = mongoose.model("ApartmentBusinessRent", apartmentBusinessRentSchema);

export default ApartmentBusinessRent;
