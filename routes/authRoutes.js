import express from "express";
import jwt from "jsonwebtoken";
import {
  loginStudent,
  registerStudent,
} from "../controllers/studentController.js";
import { loginAdmin } from "../controllers/adminController.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file
const router = express.Router();

// Student Authentication
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

// Validate Token Route
router.post("/validate-token", (req, res) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // Verify the token using the JWT secret
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Return the decoded payload (e.g., role, user ID, etc.)
    res.status(200).json({ role: decodedToken.role, userId: decodedToken.id });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Admin Authentication
router.post("/admin/login", loginAdmin);

export default router;
