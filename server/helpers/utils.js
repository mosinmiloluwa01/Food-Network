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
 * @param {object} dataObject
 * @return {object} response
 */
export const displayMessage = (res, statusCode, dataObject) => res.status(statusCode).json({
  status: statusCode < 300 ? 'success' : 'error',
  ...dataObject,
});

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
