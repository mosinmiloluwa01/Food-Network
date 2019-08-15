/* eslint-disable import/prefer-default-export */
import { decodeToken, displayMessage } from '<helpers>/utils';

export const verifyUser = (req, res, next) => {
  try {
    const { token } = req.query;

    const { id } = decodeToken(token);
    req.userId = id;
  } catch (error) {
    return displayMessage(res, 500, error, null, false);
  }
  next();
};
