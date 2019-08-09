import hashPassword from '<helpers>/utils';

describe('Hash password utility function', () => {
  it('should return a hashed password', () => {
    const password = 'password';

    const hashedPassword = hashPassword(password);

    expect(hashedPassword).toEqual(expect.anything());
  });
});
