import express from 'express';
import {
  createCategory, getCategories, updateCategory, deleteCategory
} from '<controllers>/category';
import validateCategoryInput from '<validations>/category';
import { validateIdParams, checkIsAdmin } from '<validations>/miscellaneous';
import { verifyUserToken } from '<middlewares>';

const router = express.Router();

router.post('/', verifyUserToken, checkIsAdmin, validateCategoryInput, createCategory);
router.get('/', verifyUserToken, getCategories);
router.put('/:id', verifyUserToken, checkIsAdmin, validateIdParams, updateCategory);
router.delete('/:id', verifyUserToken, checkIsAdmin, validateIdParams, deleteCategory);

export default router;
