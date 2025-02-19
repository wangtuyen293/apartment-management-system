import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema(
    {
        apartment_number: {
            type: String,
            required: true,
        },
        floor: {
            type: Number,
            required: true,
        },
        area: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["For Rent", "Rented"],
            default: "For Rent",
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

export default Apartment;
