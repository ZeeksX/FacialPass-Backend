import express from "express";
import {
  getAllCourses,
  getStudentsInCourse,
} from "../controllers/courseController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Fetch all courses for a semester
router.get("/", authMiddleware, getAllCourses);

// Fetch students registered for a specific course
router.get("/:courseId/students", authMiddleware, getStudentsInCourse);

export default router;
