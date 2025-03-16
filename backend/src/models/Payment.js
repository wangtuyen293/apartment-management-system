import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        orderCode: {
            type: Number,
            required: true,
            unique: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    }
);


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;