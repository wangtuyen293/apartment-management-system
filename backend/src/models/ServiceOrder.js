import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema(
    {
        service_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceCategory",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        }
    },
    { timestamps: true } 
);

const ServiceOrder = mongoose.model("ServiceOrder", serviceOrderSchema);

export default ServiceOrder;
