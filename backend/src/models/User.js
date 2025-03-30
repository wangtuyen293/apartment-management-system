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
            lowercase: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.providerId;
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        providerId: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        address: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        images: [
            {
                url: { type: String, required: true },
                description: { type: String },
            },
        ],
        role: {
            type: String,
            enum: ["User", "Manager"],
            default: "User",
        },
        emailVerificationOTP: {
            type: String,
        },
        emailVerificationOTPExpires: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
