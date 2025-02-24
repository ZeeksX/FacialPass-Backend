import express from "express";
import {
  registerStudent,
  loginStudent,
  getStudentDetails,
  registerCourses,
} from "../controllers/studentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student Registration & Login
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Student Dashboard
router.get("/me", authMiddleware, getStudentDetails); // Get student info (protected)
router.post("/register-courses", authMiddleware, registerCourses); // Register for semester courses

export default router;
