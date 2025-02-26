//routes/studentRoutes.js
import express from "express";
import multer from "multer";
import {
  registerStudent,
  loginStudent,
  getStudentDetails,
  registerCourses,
} from "../controllers/studentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Student Registration & Login
router.post("/register", upload.single("facial_image"), registerStudent); // Handle file upload
router.post("/login", loginStudent);

// Student Dashboard
router.get("/me", authMiddleware, getStudentDetails); // Get student info (protected)
router.post("/register-courses", authMiddleware, registerCourses); // Register for semester courses

export default router;
