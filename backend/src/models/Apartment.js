import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema(
    {
        apartmentNumber: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
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
            min: 0,
        },
        rentalTerms: {
            leaseDuration: { type: String }, // Example: "6 months", "1 year"
            monthlyRent: { type: Number, min: 0 },
        },
        status: {
            type: String,
            enum: ["Khách hẹn xem", "Đã cọc", "Đã cho thuê", "Trống", "Đang xét duyệt", "Đã bán"],
            default: "Trống",
        },
        images: [
            {
                url: { type: String, required: true },
                description: { type: String },
            },
        ],
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        startRentDate: {
            type: Date
        },
        endRentDate: {
            type: Date
        },
        services: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ServiceRequest",
            }
        ]
    },
    { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

export default Apartment;
