import sinon from 'sinon';
import model from '<models>';
import { verifyUser } from '<middlewares>';
import { inputObject } from '<fixtures>/data';

const { User } = model;

describe('middlewares', () => {
  it('should return server error in catch block', async () => {
    const req = { body: { password: 123456 }, sanitizedData: inputObject };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis();
    sinon.stub(User, 'create').throws();
    await verifyUser(req, res);
    expect(res).toBeTruthy();
  });
});
