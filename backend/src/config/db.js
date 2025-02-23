import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {

        await mongoose.connect("mongodb://localhost:27017/apartment_management_db");
        console.log("Connect database successfully!");
    } catch (err) {
        console.error("Connect database unsuccessfully. " + err.message);
    }
};

export default connectDB;
