import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
    {
        service_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceCategory",
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        apartment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending"
        },
        note: {
            type: String
        },
        requested_date: {
            type: Date,
            required: true
        }
    },
    { timestamps: true } 
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
