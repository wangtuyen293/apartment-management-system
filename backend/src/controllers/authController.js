import bcrypt from "bcrypt";
import User from "../models/users.js";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

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

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
