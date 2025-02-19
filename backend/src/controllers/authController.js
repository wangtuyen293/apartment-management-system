import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/users.js";

const JWT_SECRET = "4gk4AgeztWuwoPn1eKP92TOpEj8KMmTQ";

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, username: user.username, name: user.name, email: user.email, phoneNumber: user.phoneNumber }, JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Incorrect username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Incorrect username or password" });
        }

        const token = generateToken(user);

        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
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

        const token = generateToken(newUser);

        res.status(201).json({ token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
