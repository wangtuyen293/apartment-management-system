import mongoose from "mongoose";

const chatSupportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["In Progress", "Completed"],
            default: "In Progress",
        },
    },
    { timestamps: true }
);

const ChatSupport = mongoose.model("ChatSupport", chatSupportSchema);

export default ChatSupport;
