import express from "express";
import {
  loginStudent,
  registerStudent,
} from "../controllers/studentController.js";
import { loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// Student Authentication
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

// Admin Authentication
router.post("/admin/login", loginAdmin);

export default router;
