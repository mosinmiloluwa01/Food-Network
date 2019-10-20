const orderItems = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('OrderItems', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    menuId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Menus',
        key: 'id',
        as: 'menuId',
      }
    },
    categoryId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Categories',
        key: 'id',
        as: 'categoryId',
      }
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    orderId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
        as: 'orderId',
      }
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
  down: queryInterface => queryInterface.dropTable('OrderItems')
};
export default orderItems;
