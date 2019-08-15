export const inputObject = {
  firstName: 'mosinmiloluwa',
  lastName: 'owoso',
  email: 'mosinmiloluwa.owoso@andela.com',
  password: 'testing123',
};

export const getData = args => ({
  ...inputObject,
  ...args
});

export const resObject = {
  cookie: (accessToken, tokenObj, options) => {
    resObject.accessToken = accessToken;
    resObject.token = tokenObj.token;
    resObject.options = options;
  },
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

export const reqObject = {
  body: {
    email: 'mosinmiloluwa.owoso@andela.com',
    password: 'abcdef123',
    firstName: 'simi',
    lastName: 'test',
  }
};
