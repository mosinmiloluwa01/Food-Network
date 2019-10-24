/* eslint-disable import/prefer-default-export */
import { checkValidation, displayMessage } from '<helpers>/utils';
import models from '<models>';

const { User } = models;

export const validateIdParams = (req, res, next) => {
  const { id } = req.params;

  const data = { id };
  const rules = {
    id: 'required|integer',
  };

  const validationData = checkValidation(data, rules);
  if (validationData !== true) {
    return displayMessage(res, 400, { message: 'parameter validation error occured', errors: validationData });
  }
  next();
};

export const checkIsAdmin = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findByPk(userId);
    const { isAdmin } = user.dataValues;
    if (!isAdmin) {
      return displayMessage(res, 400, { message: 'you are not authorized to perform this action' });
    }
    next();
  } catch (error) {
    return displayMessage(res, 500, { message: 'server error', error: error.message });
  }
};
