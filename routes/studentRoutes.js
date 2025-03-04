//routes/studentRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  registerStudent,
  loginStudent,
  getStudentDetails,
  registerCourses,
  getCourses,
  selectCourse,
  dropCourse,
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
    // Extract firstname and lastname from the request body
    const { firstname, lastname } = req.body;

    // Ensure both firstname and lastname are provided
    if (!firstname || !lastname) {
      return cb(
        new Error("Firstname and lastname are required for the filename."),
        false
      );
    }

    // Get the file extension
    const fileExtension = path.extname(file.originalname);

    // Create a unique filename
    const uniqueFilename = `${firstname}-${lastname}${fileExtension}`;
    cb(null, uniqueFilename); // Use the new filename format
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

// const upload = multer({
//   storage,
//   fileFilter, // Only accept image files
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as a buffer
  fileFilter, // Only accept image files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// ✅ Route for Student Registration (with file upload)
router.post("/register", upload.single("facial_image"), registerStudent);
router.post("/login", loginStudent);

// ✅ Protected Routes
router.get("/me", authMiddleware, getStudentDetails);
router.post("/register-courses", authMiddleware, registerCourses);
router.get("/get-courses", authMiddleware, getCourses);
router.post("/select-course", authMiddleware, selectCourse);
router.delete("/drop-course", authMiddleware, dropCourse);

export default router;
