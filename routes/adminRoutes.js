import express from "express";
import {
  loginAdmin,
  getDashboardStats,
  getStudents,
  getCourses,
} from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin Login
router.post("/login", loginAdmin);

// Admin Dashboard (Protected)
router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/students", authMiddleware, getStudents);
router.get("/courses", authMiddleware, getCourses);

export default router;
