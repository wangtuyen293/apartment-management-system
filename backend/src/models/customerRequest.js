import mongoose from "mongoose";

const customerRequest = new mongoose.Schema(
    {
        apartment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["Khách hẹn xem", "Đã cọc", "Đang xét duyệt"],
        },
        date: {
            type: Date,
        },
        contractMonths: {
            type: String,
        }
    },
    { timestamps: true }
);

const CustomerRequest = mongoose.model("CustomerRequest", customerRequest);

export default CustomerRequest;
