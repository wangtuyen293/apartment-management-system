import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        apartmentNumber: {
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
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        services: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ServiceOrder",
            }
        ]
    },
    { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

export default Apartment;
