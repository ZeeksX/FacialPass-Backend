export default (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      staff_id: { type: DataTypes.STRING, unique: true },
      rank: DataTypes.STRING,
      position: {
        type: DataTypes.STRING, 
        allowNull: true, 
      },
      email: { type: DataTypes.STRING, unique: true },
      office: DataTypes.STRING,
      password_hash: DataTypes.TEXT,
      role: {
        type: DataTypes.STRING,
        defaultValue: "admin",
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Admin;
};
