import model from '<models>';
import { reqObject, resObject } from '<fixtures>/data';
import { checkIsAdmin } from './miscellaneous';

const { User } = model;

describe('checkISAdmin middleware Catch Blocks', () => {
  it('should return server error for checkIsAdmin middleware catch block', async () => {
    jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('some error'));

    await checkIsAdmin(reqObject, resObject);

    expect(resObject.status).toHaveBeenCalledWith(500);

    expect(resObject.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'server error',
      error: 'some error'
    });
  });
});
