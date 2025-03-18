import express from "express";
import {
  loginAdmin,
  getDashboardStats,
  getStudents,
  getCourses,
  registerAdmin,
  getAdminDetails,
  changePassword,
} from "../controllers/adminController.js";
import { Admin } from "../models/index.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAllAuthentications } from "../controllers/authController.js";

const router = express.Router();

// Admin Login
router.post("/login", loginAdmin);

// Route to fetch the next staff_id
router.get("/next-staff-id", async (req, res) => {
  console.log("Fetching next staff ID...");
  try {
    const lastAdmin = await Admin.findOne({
      order: [["createdAt", "DESC"]],
    });

    console.log("Last Admin:", lastAdmin); // Debugging

    let nextId = 1;
    if (lastAdmin && lastAdmin.staff_id) {
      const lastIdNumber = parseInt(lastAdmin.staff_id.replace("BU", ""), 10);
      nextId = lastIdNumber + 1;
    }

    const nextStaffId = `BU${nextId.toString().padStart(3, "0")}`;
    res.status(200).json({ nextStaffId });
  } catch (error) {
    console.error("Error fetching next staff ID:", error);
    res.status(500).json({ message: "Failed to fetch next staff ID" });
  }
});

router.post("/register", registerAdmin);
// Admin Dashboard (Protected)
router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/get-authentications", authMiddleware, getAllAuthentications);
router.get("/me", authMiddleware, getAdminDetails);
router.get("/students", authMiddleware, getStudents);
router.get("/courses", authMiddleware, getCourses);
router.put("/change-password", authMiddleware, changePassword);
export default router;
