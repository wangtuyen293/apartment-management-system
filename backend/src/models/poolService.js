import mongoose from "mongoose";

const poolServiceSchema = new mongoose.Schema(
    {
        service_type: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        service_date: {
            type: Date,
            required: true,
        },
        apartment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
            required: true,
        },
    },
    { timestamps: true }
);

const PoolService = mongoose.model("PoolService", poolServiceSchema);

export default PoolService;
