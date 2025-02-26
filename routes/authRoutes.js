import express from "express";
import {
  loginStudent,
  registerStudent,
} from "../controllers/studentController.js";
import { loginAdmin } from "../controllers/adminController.js";
import dotenv, { configDotenv } from "dotenv";

configDotenv();
const router = express.Router();

// Student Authentication
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

router.post("/validate-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    res.status(200).json({ role: decoded.role }); // Return the user role
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Admin Authentication
router.post("/admin/login", loginAdmin);

export default router;
