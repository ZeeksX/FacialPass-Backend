export default (sequelize, DataTypes) => {
  const StudentCourse = sequelize.define(
    "StudentCourse",
    {},
    { timestamps: true }
  );

  return StudentCourse;
};
