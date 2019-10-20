const orderItems = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define('orderItems', {
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: DataTypes.UUID,
    allowNull: false,
  }, {});

  OrderItems.associate = (models) => {
    OrderItems.belongsTo(models.Order, {
      as: 'order',
      foreignKey: 'orderId',
      onDelete: 'CASCADE',
    });

    OrderItems.hasMany(models.Menu, {
      as: 'menus',
      onDelete: 'CASCADE',
    });

    OrderItems.hasMany(models.Category, {
      as: 'categories',
      onDelete: 'CASCADE',
    });
  };
  return OrderItems;
};

export default orderItems;
