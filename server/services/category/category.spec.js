import model from '<models>';
import {
  createACategory, getAllCategories, updateACategory, deleteACategory
} from '<services>/category';

const { Category, sequelize } = model;

beforeAll(() => {
  sequelize.sync();
});

describe('create a category', () => {
  const mockedCreateFn = jest.spyOn(Category, 'create');
  it('should create a category', () => {
    createACategory({ name: 'break' });
    expect(mockedCreateFn.mockResolvedValue({})).toHaveBeenCalledWith({ name: 'break' });
  });

  it('should return an error in the catch block', () => {
    createACategory();
    expect(mockedCreateFn.mockRejectedValue(new Error('some error'))).toHaveBeenCalled();
  });
});

describe('delete a category', () => {
  const mockedCreateFn = jest.spyOn(Category, 'destroy');
  it('should delete a category', () => {
    deleteACategory(1);
    expect(mockedCreateFn.mockResolvedValue({})).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return an error in the catch block', () => {
    const mockedErrorFn = mockedCreateFn.mockImplementation(() => {
      throw new Error('some error');
    });
    deleteACategory({});
    expect(mockedErrorFn).toThrowError();
  });
});

describe('get all categories', () => {
  const mockedCreateFn = jest.spyOn(Category, 'findAll');
  it('should get all categories', () => {
    getAllCategories();
    expect(mockedCreateFn.mockResolvedValue({})).toHaveBeenCalled();
  });

  it('should return an error in the catch block', () => {
    getAllCategories();
    expect(mockedCreateFn.mockRejectedValue(new Error('some error'))).toHaveBeenCalled();
  });
});

describe('update a category', () => {
  const mockedCreateFn = jest.spyOn(Category, 'update');
  it('should update a category', () => {
    updateACategory(1, 'tofu');
    expect(mockedCreateFn.mockResolvedValue({})).toHaveBeenCalled();
  });

  it('should return an error in the catch block', () => {
    const mockedErrorFn = mockedCreateFn.mockImplementation(() => {
      throw new Error('some error');
    });
    updateACategory();
    expect(mockedErrorFn).toThrowError();
  });
});
