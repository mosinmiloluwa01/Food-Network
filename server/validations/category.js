import { checkValidation, displayMessage } from '<helpers>/utils';

const validateCategoryInput = (req, res, next) => {
  const { name } = req.body;

  const data = { name: name ? name.replace(/\s/g, '') : '' };
  const rules = {
    name: 'required|string|min:2',
  };

  const validationData = checkValidation(data, rules);
  if (validationData !== true) {
    return displayMessage(res, 400, { message: 'validation error occured', errors: validationData });
  }
  req.body = { name: name.replace(/\s/g, '') };
  next();
};

export default validateCategoryInput;
