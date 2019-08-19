import bcrypt from 'bcryptjs';
import validator from 'validatorjs';
import jwt from 'jsonwebtoken';
import sendGrid from '@sendgrid/mail';

/**
 * @param {string} password
 * @return {string} hash
 */
export const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * @param {object} inputObject
 * @return {object} sanitized data
 */
export const trimAndConvertToLowercase = (inputObject) => {
  const sanitizedData = {};
  Object.entries(inputObject).forEach((element) => {
    const key = element[0];
    const value = element[1];
    sanitizedData[key] = value.replace(/\s/g, '').toLowerCase();
  });
  return sanitizedData;
};

/**
 * @param {object} data
 * @param {object} rules
 * @param {object} res
 * @return {object} response
 */
export const checkValidation = (data, rules) => {
  const validation = new validator(data, rules);

  return validation.passes() ? true : validation.errors.all();
};

/**
 * @param {object} res
 * @param {integer} statusCode
 * @param {string} message
 * @param {object} data
 * @param {boolean} success
 * @return {object} response
 */
export const displayMessage = (
  res, statusCode, message, data, success = true
) => {
  const payload = success === true ? 'data' : 'error';

  return res.status(statusCode).json({
    status: success === true ? 'success' : 'error',
    message,
    [payload]: data
  });
};

/**
 * @param {object} payload
 * @param {string} tokenExpiryDate
 * @param {string} secret
 * @param {string} email
 * @return {string} token
 */
export const tokenGenerator = (payload, tokenExpiryDate = '1h', secret = 'secret') => {
  const token = jwt.sign(payload, secret, { expiresIn: tokenExpiryDate });
  return token;
};

/**
 * @param {object} payload
 * @param {string} cookieExpiryDate
 * @param {object} res
 * @return {string} cookie
 */
export const cookieGenerator = (payload, cookieExpiryDate = 3.6e6, res) => res.cookie(
  'access-token',
  { token: tokenGenerator(payload, process.env.TOKEN_EXPIRY_DATE, process.env.SECRET) },
  {
    httpOnly: true,
    secure: false,
    maxAge: cookieExpiryDate
  }
);

/**
 * @param {string} sendgridApiKey
 * @param {string} to
 * @param {string} from
 * @param {string} subject
 * @param {string} html
 * @return {string} emailResponse
 */
export const sendMail = async (sendgridApiKey, to, from, subject, html) => {
  sendGrid.setApiKey(sendgridApiKey);
  const msg = {
    to,
    from,
    subject,
    html
  };
  const emailResponse = await sendGrid.send(msg);
  return emailResponse;
};

export const decodeToken = token => jwt.verify(token, process.env.SECRET);

export const comparePassword = (dbPassword, password) => bcrypt.compareSync(password, dbPassword);
