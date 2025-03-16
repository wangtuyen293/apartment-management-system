import mongoose from "mongoose";

const manageFeeSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            default: 500000,
        },
        billing_date: {
            type: Date,
            required: true,
        },
        apartment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const ManageFee = mongoose.model("ManageFee", manageFeeSchema);

export default ManageFee;
