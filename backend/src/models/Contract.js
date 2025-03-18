import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true,
        index: true
    },

    contractPath: {
        type: String,
        required: true,
        trim: true
    },

    fileName: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ['Deposit', 'Extended', 'Living'],
        default: 'Living',
        required: true
    },

    contractMonths: {
        type: Number,
    },

    signedAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {
        createdAt: 'signedAt',
        updatedAt: 'updatedAt'
    }
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;