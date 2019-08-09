

const menu = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Menus', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    priceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Menus')
};
export default menu;
