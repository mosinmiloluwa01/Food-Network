import supertest from 'supertest';
import sgMail from '@sendgrid/mail';
import model from '<models>';
import app from '<server>/app';
import {
  getData, inputObject, reqObject, resObject
} from '<fixtures>/data';
import { signup, verifyAccount, login } from '<controllers>/authentication';
import { tokenGenerator, cookieGenerator, displayMessage } from '<helpers>/utils';

const { User, sequelize } = model;

const server = () => supertest(app);

let user, token;


const { TOKEN_EXPIRY_DATE, SECRET } = process.env;

const utils = {
  cookieGenerator,
  displayMessage,
};

beforeAll(async () => {
  sequelize.sync();

  const userData = getData({ email: 'mosinmiloluwa.o@gmail.com' });
  const newUser = await User.create(userData);
  user = newUser.get({ plain: true });

  const payload = {
    id: user.id,
    isVerified: false
  };
  token = tokenGenerator(payload, TOKEN_EXPIRY_DATE, SECRET);

  jest.spyOn(sgMail, 'setApiKey').mockReturnValue();
  jest.spyOn(sgMail, 'send').mockResolvedValue({});
  jest.spyOn(utils, 'cookieGenerator').mockReturnValue();
  jest.spyOn(utils, 'displayMessage').mockReturnValue();
});

afterAll(() => {
  sequelize.close();
});

describe('signup validations', () => {
  it('should not create a user with empty information', (done) => {
    server()
      .post('/api/v1/auth/signup')
      .send(getData({
        firstName: '', lastName: '', email: '', password: ''
      }))
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'validation error occured');
        expect(res.body.error.firstName[0]).toEqual('The firstName field is required.');
        expect(res.body.error.lastName[0]).toEqual('The lastName field is required.');
        expect(res.body.error.email[0]).toEqual('The email field is required.');
        expect(res.body.error.password[0]).toEqual('The password field is required.');
        done();
      });
  });

  it('should not create a user with invalid values', (done) => {
    server()
      .post('/api/v1/auth/signup')
      .send(getData({
        firstName: '1', lastName: '1', email: '1'
      }))
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'validation error occured');
        expect(res.body.error.firstName[0]).toEqual('The firstName field must contain only alphabetic characters.');
        expect(res.body.error.lastName[0]).toEqual('The lastName field must contain only alphabetic characters.');
        expect(res.body.error.email[0]).toEqual('The email format is invalid.');
        done();
      });
  });
});

describe('login validations', () => {
  it('should not login a user with empty information', (done) => {
    server()
      .post('/api/v1/auth/login')
      .send(getData({
        email: '', password: ''
      }))
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'validation error occured');
        expect(res.body.error.email[0]).toEqual('The email field is required.');
        expect(res.body.error.password[0]).toEqual('The password field is required.');
        done();
      });
  });

  it('should not create a user with invalid values', (done) => {
    server()
      .post('/api/v1/auth/login')
      .send(getData({ email: '1' }))
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'validation error occured');
        expect(res.body.error.email[0]).toEqual('The email format is invalid.');
        done();
      });
  });
});


describe('verify account controller', () => {
  it('should verify user', (done) => {
    server()
      .patch(`/api/v1/auth/verify?token=${token}`)
      .send(inputObject)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User email verified successfully');
        expect(res.body).toHaveProperty('data');
        done();
      });
  });
});

describe('signup', () => {
  it('should create a new user', (done) => {
    server()
      .post('/api/v1/auth/signup')
      .send(inputObject)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'success, please go to your inbox to verify your account');
        expect(res.body).toHaveProperty('data');
        done();
      });
  });

  it('should not create a duplicate user', (done) => {
    server()
      .post('/api/v1/auth/signup')
      .send(inputObject)
      .end((err, res) => {
        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('message', 'email exists');
        expect(res.body).toHaveProperty('error');
        done();
      });
  });
});

describe('login', () => {
  it('should login', (done) => {
    server()
      .post('/api/v1/auth/login')
      .send(inputObject)
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Authentication successful');
        expect(res.body).toHaveProperty('data');
        done();
      });
  });

  it('should not login user with credentials that does not exist', (done) => {
    server()
      .post('/api/v1/auth/login')
      .send(getData({ email: 'mosinmiloluwao.owoso@andela.com' }))
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Authentication failed');
        expect(res.body).toHaveProperty('error');
        done();
      });
  });

  it('should not login user with invalid credentials', (done) => {
    server()
      .post('/api/v1/auth/login')
      .send(getData({ password: '12345678' }))
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Authentication failed');
        expect(res.body).toHaveProperty('error');
        done();
      });
  });
});

describe('Authentication Controller Catch Blocks', () => {
  it('should return server error for signup controller catch block', async () => {
    jest.spyOn(User, 'create').mockRejectedValue(new Error('some error'));

    await signup(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'some error',
      error: null
    });
  });

  it('should return server error for verify controller catch block', async () => {
    jest.spyOn(User, 'update').mockRejectedValue(new Error('some error'));

    await verifyAccount(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'some error',
      error: null
    });
  });

  it('should return server error for verify controller catch block', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('some error'));

    await login(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'some error',
      error: null
    });
  });
});
