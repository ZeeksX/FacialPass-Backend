import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import {
  loginStudent,
  registerStudent,
} from "../controllers/studentController.js";
import { loginAdmin } from "../controllers/adminController.js";
import dotenv from "dotenv";
import {
  saveAuthenticationDetails,
  verifyStudent,
} from "../controllers/authController.js";

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

//get known faces in the backend
router.get("/known-faces", (req, res) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const files = fs.readdirSync(uploadsDir);

  const knownFaces = files
    .filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg"))
    .map((file) => {
      const filePath = path.join(uploadsDir, file);
      const imageBuffer = fs.readFileSync(filePath);
      return {
        name: file.split(".")[0], // Use filename as the name (e.g., matricNumber)
        image: imageBuffer.toString("base64"), // Convert image to base64
      };
    });

  res.json(knownFaces);
});

// authenticate students for exams
router.post("/authenticate", verifyStudent);

//post authenticated details to the db
router.post("/save-authentication", saveAuthenticationDetails);

// Admin Authentication
router.post("/admin/login", loginAdmin);

export default router;
