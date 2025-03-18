import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
        },
        type: {
            type: String,
            enum: ["service_request", "appointment", "promotion", "general"],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        is_read: {
            type: Boolean,
            default: false
        },
        metadata: {
            type: Object, // Lưu trữ dữ liệu bổ sung (ví dụ: ID dịch vụ, ID cuộc hẹn,...)
            default: {}
        }
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
