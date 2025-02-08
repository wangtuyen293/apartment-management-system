import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"],
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        roles: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
