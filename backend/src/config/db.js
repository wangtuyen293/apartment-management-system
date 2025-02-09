import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Connect database successfully!");
    } catch (err) {
        console.error("Connect database unsuccessfully. " + err.message);
    }
};

export default connectDB;
