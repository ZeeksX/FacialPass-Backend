export default (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      staff_id: { type: DataTypes.STRING, unique: true },
      office: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password_hash: DataTypes.TEXT,
      role: {
        type: DataTypes.STRING,
        defaultValue: "admin",
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  // Function to generate the next staff ID
  const generateStaffId = async () => {
    const lastAdmin = await Admin.findOne({
      order: [["createdAt", "DESC"]],
    });

    let nextId = 1;
    if (lastAdmin && lastAdmin.staff_id) {
      const lastIdNumber = parseInt(lastAdmin.staff_id.replace("BU", ""), 10);
      nextId = lastIdNumber + 1;
    }

    return `BU${nextId.toString().padStart(3, "0")}`;
  };

  // BeforeCreate hook to assign staff_id
  Admin.beforeCreate(async (admin) => {
    admin.staff_id = await generateStaffId();
  });

  return Admin;
};
