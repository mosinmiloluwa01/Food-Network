/* eslint-disable import/prefer-default-export */
import { decodeToken, displayMessage } from '<helpers>/utils';

export const verifyUser = (req, res, next) => {
  try {
    const { token } = req.query;

    const { id } = decodeToken(token);
    req.userId = id;
    next();
  } catch (error) {
    return displayMessage(res, 500, { message: 'server error', error: error.message });
  }
};

export const verifyUserToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return displayMessage(res, 400, { message: 'token is not supplied' });
    }
    const { id } = decodeToken(token);
    req.userId = id;
    next();
  } catch (error) {
    return displayMessage(res, 400, { message: 'Authorization failed', error: error.message });
  }
};
