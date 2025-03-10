//models/examAuthentication.js
export default (sequelize, DataTypes) => {
  const ExamAuthentication = sequelize.define(
    "ExamAuthentication",
    {
      matricNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courseCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    }
  );

  return ExamAuthentication;
};
