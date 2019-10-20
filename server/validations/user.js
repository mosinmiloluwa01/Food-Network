import model from '<models>';
import { trimAndConvertToLowercase, checkValidation, displayMessage } from '<helpers>/utils';

const { User } = model;

export const validateSignupData = async (req, res, next) => {
  const sanitizedData = trimAndConvertToLowercase(req.body);

  const { email, firstName, lastName } = sanitizedData;

  const { password } = req.body;

  const data = {
    email, firstName, lastName, password
  };

  const rules = {
    email: 'required|email',
    firstName: 'required|string|alpha|min:2',
    lastName: 'required|string|alpha|min:2',
    password: 'required|string'
  };

  const validationData = checkValidation(data, rules);
  if (validationData !== true) {
    return displayMessage(res, 400, { message: 'validation error occured', errors: validationData });
  }

  const userEmailExist = await User.findOne({ where: { email } });

  if (userEmailExist) {
    return displayMessage(res, 409, { message: 'email exists' });
  }

  req.body = sanitizedData;
  return next();
};

export const validateLoginData = async (req, res, next) => {
  const sanitizedData = trimAndConvertToLowercase(req.body);

  const { email } = sanitizedData;

  const { password } = req.body;

  const data = { email, password };

  const rules = {
    email: 'required|email',
    password: 'required|string'
  };

  const validationData = checkValidation(data, rules);
  if (validationData !== true) {
    return displayMessage(res, 400, { message: 'validation error occured', errors: validationData });
  }

  req.body = sanitizedData;
  return next();
};
export default validateSignupData;
