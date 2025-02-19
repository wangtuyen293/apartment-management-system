import mongoose from "mongoose";

const electronFeeSchema = new mongoose.Schema(
    {
        amount: {
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
    },
    { timestamps: true }
);

const ElectronFee = mongoose.model("ElectronFee", electronFeeSchema);

export default ElectronFee;
