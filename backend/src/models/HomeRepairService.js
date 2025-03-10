import mongoose from "mongoose";

const homeRepairServiceSchema = new mongoose.Schema(
    {
        service_type: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        repair_date: {
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

const HomeRepairService = mongoose.model("HomeRepairService", homeRepairServiceSchema);

export default HomeRepairService;
