import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;

        user.name = req.body.name ?? user.name;
        user.username = req.body.username ?? user.username;
        user.email = req.body.email ?? user.email;
        user.phoneNumber = req.body.phoneNumber ?? user.phoneNumber;
        user.address = req.body.address ?? user.address;
        user.gender = req.body.gender ?? user.gender;

        const updatedUser = await user.save();

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Mật khẩu đã được cập nhật thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const userId = req.user.id;
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { images: [{ url: avatarUrl }] } },
            { new: true }
        );

        res.status(200).json({
            message: "Avatar uploaded successfully",
            avatarUrl: user.images[0].url,
        });
    } catch (error) {
        console.error("Error uploading avatar:", error);
        res.status(500).json({
            message: "Error uploading avatar",
            error: error.message,
        });
    }
};

// Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const banAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: user.isActive
                ? "Tài khoản đã được mở khóa"
                : "Tài khoản đã bị khóa",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newRole } = req.body;

        const validRoles = ["User", "Manager"];

        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ message: "Vai trò không hợp lệ." });
        }

        const user = await User.findById(userId);

        user.role = newRole;
        await user.save();

        res.status(200).json({ message: "Cập nhật vai trò thành công.", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const deleteUserByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        res.status(200).json({ message: "Xoá người dùng thành công" });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};
