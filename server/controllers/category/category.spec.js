import supertest from 'supertest';
import model from '<models>';
import app from '<server>/app';
import { adminUser, reqObject, resObject } from '<fixtures>/data';
import { tokenGenerator } from '<helpers>/utils';
import {
  createCategory, updateCategory, deleteCategory, getCategories
} from './index';

const { User, Category, sequelize } = model;
let user, token, anotherToken;
const { TOKEN_EXPIRY_DATE, SECRET } = process.env;

const server = () => supertest(app);

beforeAll(async () => {
  sequelize.sync();
  const newUser = await User.create(adminUser);
  user = newUser.get({ plain: true });

  const normalUser = await User.findAll({
    where: { email: 'mosinmiloluwa.o@gmail.com' }
  });

  const payload = {
    id: user.id,
    isVerified: true
  };
  token = tokenGenerator(payload, TOKEN_EXPIRY_DATE, SECRET);

  const userPayload = {
    id: normalUser[0].dataValues.id,
    isVerified: true
  };
  anotherToken = tokenGenerator(userPayload, TOKEN_EXPIRY_DATE, SECRET);
});

afterAll(async () => {
  await User.destroy({
    where: { email: adminUser.email }
  });
  sequelize.close();
});

describe('integration test: POST category', () => {
  it('should not create a category if token is not supplied', (done) => {
    server()
      .post('/api/v1/categories')
      .send({ name: 'breakfast' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'token is not supplied');
        done();
      });
  });

  it('should not create a category if token is invalid', (done) => {
    server()
      .post('/api/v1/categories')
      .set('Authorization', `${token}99087`)
      .send({ name: 'breakfast' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Authorization failed');
        expect(res.body).toHaveProperty('error', 'invalid signature');
        done();
      });
  });

  it('should not create a category if not admin', (done) => {
    server()
      .post('/api/v1/categories')
      .set('Authorization', anotherToken)
      .send({ name: 'breakfast' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'you are not authorized to perform this action');
        done();
      });
  });

  it('should not create a category if req.body.name is not passed', (done) => {
    server()
      .post('/api/v1/categories')
      .set('Authorization', token)
      .send()
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'validation error occured');
        expect(res.body.errors.name[0]).toEqual('The name field is required.');
        done();
      });
  });

  it('should not create a category if req.body.name is empty', (done) => {
    server()
      .post('/api/v1/categories')
      .set('Authorization', token)
      .send({ name: '' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'validation error occured');
        expect(res.body.errors.name[0]).toEqual('The name field is required.');
        done();
      });
  });

  it('should create a category', (done) => {
    server()
      .post('/api/v1/categories')
      .set('Authorization', token)
      .send({ name: 'breakfast' })
      .end((err, res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'category created successfully');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('name', 'breakfast');
        done();
      });
  });
});

describe('integration test: GET category', () => {
  it('should fetch all categories', (done) => {
    server()
      .get('/api/v1/categories')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'category retrieved successfully');
        expect(res.body.data[0]).toHaveProperty('id');
        expect(res.body.data[0]).toHaveProperty('name');
        done();
      });
  });
});

describe('integration test: PUT category', () => {
  it('should not update a category if not admin', (done) => {
    server()
      .delete('/api/v1/categories/l')
      .set('Authorization', anotherToken)
      .send({ name: 'breakfast1' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'you are not authorized to perform this action');
        done();
      });
  });

  it('should not update a category if params is invalid', (done) => {
    server()
      .put('/api/v1/categories/a')
      .set('Authorization', token)
      .send({ name: 'breakfast' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors.id[0]).toEqual('The id must be an integer.');
        done();
      });
  });

  it('should not update a category if category is not found', (done) => {
    server()
      .put('/api/v1/categories/100')
      .set('Authorization', token)
      .send({ name: 'breakfast' })
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'category not found');
        done();
      });
  });

  it('should update a category', (done) => {
    server()
      .put('/api/v1/categories/2')
      .set('Authorization', token)
      .send({ name: 'breakfast' })
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'category updated successfully');
        done();
      });
  });
});

describe('integration test: DELETE category', () => {
  it('should not delete a category if not admin', (done) => {
    server()
      .delete('/api/v1/categories/a')
      .set('Authorization', anotherToken)
      .send({ name: 'breakfast1' })
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'you are not authorized to perform this action');
        done();
      });
  });

  it('should not delete a category if params is invalid', (done) => {
    server()
      .delete('/api/v1/categories/a')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors.id[0]).toEqual('The id must be an integer.');
        done();
      });
  });

  it('should not delete a category if it is not found', (done) => {
    server()
      .delete('/api/v1/categories/100')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'category not found');
        done();
      });
  });

  it('should delete a category', (done) => {
    server()
      .delete('/api/v1/categories/2')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'category deleted successfully');
        done();
      });
  });
});

describe('Category Controller Catch Blocks', () => {
  it('should return server error for create category controller catch block', async () => {
    jest.spyOn(Category, 'create').mockRejectedValue(new Error('some error'));

    await createCategory(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'a server error has occured',
      error: 'some error'
    });
  });

  it('should return server error for verify controller catch block', async () => {
    jest.spyOn(Category, 'update').mockRejectedValue(new Error('some error'));

    await updateCategory(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'a server error has occured',
      error: 'some error'
    });
  });

  it('should return server error for verify controller catch block', async () => {
    jest.spyOn(Category, 'findAll').mockRejectedValue(new Error('some error'));

    await getCategories(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'a server error has occured',
      error: 'some error'
    });
  });

  it('should return server error for verify controller catch block', async () => {
    jest.spyOn(Category, 'destroy').mockRejectedValue(new Error('some error'));

    await deleteCategory(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'a server error has occured',
      error: 'some error'
    });
  });
});
