import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  registerStudent,
  loginStudent,
  getStudentDetails,
  registerCourses,
} from "../controllers/studentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ensure 'uploads/' directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique filename
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as a buffer
  fileFilter, // Only accept image files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Student Registration & Login
router.post("/register", upload.single("facial_image"), registerStudent); // Handle file upload
router.post("/login", loginStudent);

// Student Dashboard
router.get("/me", authMiddleware, getStudentDetails); // Get student info (protected)
router.post("/register-courses", authMiddleware, registerCourses); // Register for semester courses

export default router;
