import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import createStudentModel from "./student.js";
import createAdminModel from "./admin.js";
import createDepartmentModel from "./department.js";
import createCourseModel from "./course.js";
import createStudentCourseModel from "./studentCourse.js";
import createSemesterRegistrationModel from "./semesterRegistration.js";
import createExamAuthenticationModel from "./examAuthentication.js";

// Create models
const Student = createStudentModel(sequelize, Sequelize);
const Admin = createAdminModel(sequelize, Sequelize);
const Department = createDepartmentModel(sequelize, Sequelize);
const Course = createCourseModel(sequelize, Sequelize);
const StudentCourse = createStudentCourseModel(sequelize, Sequelize);
const SemesterRegistration = createSemesterRegistrationModel(
  sequelize,
  Sequelize
);
const ExamAuthentication = createExamAuthenticationModel(sequelize, Sequelize);

// Define relationships
Department.hasMany(Student, { foreignKey: "department_id" });
Student.belongsTo(Department, { foreignKey: "department_id" });

Department.hasMany(Admin, { foreignKey: "department_id" });
Admin.belongsTo(Department, { foreignKey: "department_id" });

Department.hasMany(Course, { foreignKey: "department_id" });
Course.belongsTo(Department, { foreignKey: "department_id" });

Student.belongsToMany(Course, {
  through: StudentCourse,
  foreignKey: "student_id",
});
Course.belongsToMany(Student, {
  through: StudentCourse,
  foreignKey: "course_id",
});

Student.hasMany(SemesterRegistration, { foreignKey: "student_id" });
SemesterRegistration.belongsTo(Student, { foreignKey: "student_id" });

Student.hasMany(ExamAuthentication, { foreignKey: "student_id" });
ExamAuthentication.belongsTo(Student, { foreignKey: "student_id" });

// Export models and sequelize instance
export {
  sequelize,
  Student,
  Admin,
  Department,
  Course,
  StudentCourse,
  SemesterRegistration,
  ExamAuthentication,
};
