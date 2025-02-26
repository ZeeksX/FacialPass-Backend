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

// ✅ Correct storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique filename
  },
});

// ✅ Ensure fileFilter is used properly
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: multer,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ✅ Route for Student Registration (with file upload)
router.post("/register", upload.single("facial_image"), registerStudent);
router.post("/login", loginStudent);

// ✅ Protected Routes
router.get("/me", authMiddleware, getStudentDetails);
router.post("/register-courses", authMiddleware, registerCourses);

export default router;
