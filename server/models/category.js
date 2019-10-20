const category = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name is required.'
        }
      }
    },
  }, {});
  Category.associate = (models) => {
    Category.hasMany(models.Menu, {
      as: 'menus',
      onDelete: 'CASCADE',
    });
  };
  return Category;
};

export default category;
