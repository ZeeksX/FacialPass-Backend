export default (sequelize, DataTypes) => {
  const SemesterRegistration = sequelize.define(
    "SemesterRegistration",
    {
      semester: DataTypes.STRING,
      academic_year: DataTypes.STRING,
    },
    { timestamps: true }
  );

  return SemesterRegistration;
};
