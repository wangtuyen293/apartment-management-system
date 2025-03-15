import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Connect database successfully!");
    } catch (err) {
        console.error("Connect database fail:" + err.message);
        process.exit(1);
    }
};

export default connectDB;
