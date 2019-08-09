const order = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      menuId: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
      },
      quantity: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      isCheckedOut: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  Order.associate = (models) => {
    Order.belongsToMany(models.User, {
      through: 'cart',
      as: 'owner',
      foreignKey: 'userId',
      otherKey: 'orderId',
      onDelete: 'CASCADE',
    });
  };
  return Order;
};

export default order;
