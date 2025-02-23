import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/v1", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/apartments", apartmentRoutes);
app.use("/api/v1/residents", residentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
