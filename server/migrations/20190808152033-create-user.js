

const user = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      unique: true,
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    profileImg: {
      type: Sequelize.STRING
    },
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};
export default user;
