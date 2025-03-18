import express from "express";
import {
    getUserNotifications,
    getAllNotifications,
    createNotification,
    markNotificationAsRead,
    deleteNotification,
    sendNotificationToAllUsers
} from "../controllers/notificationController.js";

const router = express.Router();

// 🟢 API: Lấy thông báo của một User
router.get("/user/:userId", getUserNotifications);

// 🟢 API: Lấy tất cả thông báo (Admin hoặc hệ thống)
router.get("/", getAllNotifications);

// 🟢 API: Tạo thông báo mới
router.post("/", createNotification);

// 🟢 API: Đánh dấu thông báo là đã đọc
router.put("/:id/read", markNotificationAsRead);

// 🟢 API: Xóa thông báo
router.delete("/:id", deleteNotification);

// 🟢 API: Gửi thông báo đến tất cả User
router.post("/send-all", sendNotificationToAllUsers);

export default router;
