import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const adminAuth = async (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (user && user.role === "Manager") {
        next();
    } else {
        res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này." });
    }
};
