import express from "express";
import "dotenv/config";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import "./config/passport.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

const resourcesPath = path.join(__dirname, 'controllers/resources');
console.log('Resources path:', resourcesPath);
app.use('/resources', express.static(resourcesPath));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
console.log('Uploads path:', path.join(__dirname, 'uploads'));

app.use("/uploads/avatars", express.static(path.join(__dirname, "..", "uploads/avatars")));

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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/contracts", contractRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});