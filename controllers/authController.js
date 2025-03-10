//controllers/authController.js
import { Student, Course } from "../models/index.js";

// Verify student details
export const verifyStudent = async (req, res) => {
  try {
    const { firstname, lastname, courseId } = req.body;

    // Check if the student exists and is registered for the course
    const student = await Student.findOne({
      where: { firstname, lastname },
      include: [
        {
          model: Course,
          through: { where: { course_id: courseId } },
        },
      ],
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Student is not registered for this course",
      });
    }

    return res.json({
      success: true,
      message: `Authenticated: ${student.firstname} ${student.lastname}`,
      student: {
        firstname: student.firstname,
        lastname: student.lastname,
        matricNumber: student.matricNumber,
        department: student.department,
      },
    });
  } catch (error) {
    console.error("Error authenticating student:", error);
    return res
      .status(500)
      .json({ success: false, message: "Authentication error" });
  }
};
