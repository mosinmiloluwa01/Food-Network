import model from '<models>';

const { Category } = model;

export const createACategory = async (data) => {
  try {
    const category = await Category.create(data);
    return category;
  } catch (error) {
    throw error.message;
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name']
    });
    return categories;
  } catch (error) {
    throw error.message;
  }
};

export const updateACategory = async (id, name) => {
  try {
    const category = await Category.update(
      { name },
      { where: { id } }
    );
    return category;
  } catch (error) {
    throw error.message;
  }
};

export const deleteACategory = async (id) => {
  try {
    const category = await Category.destroy(
      { where: { id } }
    );
    return category;
  } catch (error) {
    throw error.message;
  }
};
