import bcrypt from "bcrypt";
import User from "../models/users.js";

export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            name,
            gender,
            address,
            phoneNumber,
        } = req.body;

        if (!username || !email || !password || !name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });
        if (existingEmail || existingUsername) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            name,
            gender: gender || "Other",
            address: address || "",
            phoneNumber: phoneNumber || "",
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUser = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
