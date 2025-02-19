import mongoose from "mongoose";

const serviceFeeSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        service_type: {
            type: String,
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

const ServiceFee = mongoose.model("ServiceFee", serviceFeeSchema);

export default ServiceFee;
