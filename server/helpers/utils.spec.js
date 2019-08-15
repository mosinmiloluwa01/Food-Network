import bcrypt from 'bcryptjs';
import {
  hashPassword, trimAndConvertToLowercase, tokenGenerator, cookieGenerator,
} from '<helpers>/utils';
import { inputObject, resObject } from '<fixtures>/data';

describe('Hash password utility function', () => {
  it('should return a hashed password', () => {
    const hash = '$2a$10$RqXrPlH3Mgjc2.pLztGhXuFxxfe9AIac41ZSD3ksZ.s7prNomGVUm';
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hash);

    const hashedPassword = hashPassword('secret');

    expect(hashedPassword).toEqual(hash);
  });
});

describe('trimAndConvertToLowercase utility function', () => {
  it('should trim spaces and convert to lowercase', () => {
    const sanitizedData = trimAndConvertToLowercase(inputObject);

    expect(sanitizedData).toHaveProperty('firstName', 'mosinmiloluwa');
    expect(sanitizedData).toHaveProperty('lastName', 'owoso');
  });
});

describe('Token Generator', () => {
  let token, token2;
  it('should generate token with default values', () => {
    try {
      token = tokenGenerator({ id: '5c1d4726-647e-4f77-a251-10381d3510f3', isVerified: false });
    } catch (error) {
      console.log(error);
    }

    expect(typeof token).toBe('string');
  });

  it('should generate token with all parameters', () => {
    try {
      token2 = tokenGenerator({ id: '5c1d4726-647e-4f77-a251-10381d3510f3', isVerified: false }, '1h', 'secret', 3.6e6, 'mosinmi@gmail.com');
    } catch (error) {
      console.log(error);
    }

    expect(typeof token2).toBe('string');
  });
});

describe('Cookie Generator', () => {
  it('should generate cookie with default values', () => {
    cookieGenerator({ id: '5c1d4726-647e-4f77-a251-10381d3510f3', isVerified: false }, 3600, resObject);
    cookieGenerator({ id: '5c1d4726-647e-4f77-a251-10381d3510f3', isVerified: false }, undefined, resObject);

    expect(typeof resObject.token).toBe('string');
  });
});
