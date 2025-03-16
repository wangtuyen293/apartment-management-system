import mongoose from "mongoose";

const waterFeeSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        amount_month: {
            type: Number,
            required: true,
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

const WaterFee = mongoose.model("WaterFee", waterFeeSchema);

export default WaterFee;
