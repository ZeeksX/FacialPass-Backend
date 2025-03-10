//models/index.js
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import createStudentModel from "./student.js";
import createAdminModel from "./admin.js";
import createDepartmentModel from "./department.js";
import createCourseModel from "./course.js";
import createStudentCourseModel from "./studentCourse.js";
import createSemesterRegistrationModel from "./semesterRegistration.js";
import createExamAuthenticationModel from "./examAuthentication.js";

// Create models (pass only `sequelize` and `DataTypes`)
const Student = createStudentModel(sequelize, DataTypes);
const Admin = createAdminModel(sequelize, DataTypes);
const Department = createDepartmentModel(sequelize, DataTypes);
const Course = createCourseModel(sequelize, DataTypes);
const StudentCourse = createStudentCourseModel(sequelize, DataTypes);
const SemesterRegistration = createSemesterRegistrationModel(sequelize, DataTypes);
const ExamAuthentication = createExamAuthenticationModel(sequelize, DataTypes);

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

// Export models
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