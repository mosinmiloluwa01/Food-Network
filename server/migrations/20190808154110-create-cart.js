

const cart = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Carts', {
    orderId: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    userId: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    quantity: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Carts')
};
export default cart;
