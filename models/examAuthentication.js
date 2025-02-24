export default (sequelize, DataTypes) => {
  const ExamAuthentication = sequelize.define(
    "ExamAuthentication",
    {
      exam_date: DataTypes.DATE,
      authenticated: { type: DataTypes.BOOLEAN, defaultValue: false },
      authenticated_at: DataTypes.DATE,
    },
    { timestamps: true }
  );

  return ExamAuthentication;
};
