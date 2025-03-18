import Notification from "../models/Notification.js";
import User from "../models/User.js";

// 🟢 Lấy tất cả thông báo của một User
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({
            $or: [
                { user_id: userId }, // Thông báo riêng của user
                { user_id: "" },     // Thông báo chung
                { user_id: null }    // Nếu có thông báo null user_id
            ]
        }).sort({ createdAt: -1 });
        console.log(notifications);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông báo", error });
    }
};

// 🟢 Lấy tất cả thông báo (Admin hoặc hệ thống)
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy tất cả thông báo", error });
    }
};

// 🟢 Tạo một thông báo mới
export const createNotification = async (req, res) => {
    try {
        const { user_id, type, title, message, metadata } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin!" });
        }

        const newNotification = new Notification({
            user_id: user_id, // Nếu user_id rỗng, để null (Gửi cho tất cả)
            type: type || "general",
            title,
            message,
            metadata: metadata || {},
        });

        await newNotification.save();
        res.status(201).json({ message: "Thông báo đã được tạo!", notification: newNotification });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo thông báo", error });
    }
};

// 🟢 Cập nhật trạng thái đã đọc
export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Thông báo không tồn tại!" });
        }

        notification.is_read = true;
        await notification.save();
        res.status(200).json({ message: "Thông báo đã được đánh dấu là đã đọc!", notification });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật thông báo", error });
    }
};

// 🟢 Xóa một thông báo
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Thông báo không tồn tại!" });
        }

        await notification.deleteOne();
        res.status(200).json({ message: "Thông báo đã bị xóa!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa thông báo", error });
    }
};

// 🟢 Gửi thông báo đến tất cả người dùng
export const sendNotificationToAllUsers = async (req, res) => {
    try {
        const { type, title, message, metadata } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: "Vui lòng cung cấp tiêu đề và nội dung thông báo!" });
        }

        const users = await User.find({}, "_id");
        const notifications = users.map(user => ({
            user_id: user._id,
            type,
            title,
            message,
            metadata
        }));

        await Notification.insertMany(notifications);
        res.status(201).json({ message: "Thông báo đã được gửi đến tất cả người dùng!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi gửi thông báo cho tất cả người dùng", error });
    }
};
