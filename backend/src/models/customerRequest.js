import mongoose from "mongoose";

const customerRequest = new mongoose.Schema(
    {
        apartment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["Khách hẹn xem", "Đã cọc", "Đang xét duyệt", "Gia hạn hợp đồng", "Chấm dứt hợp đồng"],
        },
        action: {
            type: String,
            enum: ["Đồng ý", "Từ chối"],
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
