import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        blacklistedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const BlacklistToken = mongoose.model("blacklistTokens", blacklistTokenSchema);

export default BlacklistToken;
