import express from "express";
import "dotenv/config";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import "./config/passport.js";

const app = express();
connectDB();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/apartments", apartmentRoutes);
app.use("/api/v1/residents", residentRoutes);
app.use("/api/v1/", authRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/contracts", contractRoutes);
app.use("/api/v1/services", serviceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
