import mongoose from "mongoose";
import { type } from "os";

const BillSchema = new mongoose.Schema(
    {
        typeOfPaid: {
            type: String,
            enum: ["Living", "Service", "Deposit"],
            required: true
        },
        fee: {
            type: Number,
            required: true,
        },
        billing_date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Paid", "Unpaid"],
            default: "Unpaid"
        },
        orderCode: {
            type: Number
        },
        apartment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Bill = mongoose.model("Bill", BillSchema);

export default Bill;
