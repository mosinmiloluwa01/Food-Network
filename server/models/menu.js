
const menu = (sequelize, DataTypes) => {
  const Menu = sequelize.define('Menu', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name is required.'
        }
      }
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'image must be a url.'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'price is required.'
        }
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'categoryId is required.'
        }
      }
    }
  }, {});
  Menu.associate = (models) => {
    Menu.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
    });
  };
  return Menu;
};

export default menu;
