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
    Order.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Order;
};

export default order;
