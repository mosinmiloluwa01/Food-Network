import express from 'express';
import { signup, verifyAccount, login } from '<controllers>/authentication';
import { validateSignupData, validateLoginData } from '<validations>/user';
import { verifyUser } from '<middlewares>';

const router = express.Router();

router.post('/signup', validateSignupData, signup);
router.post('/login', validateLoginData, login);
router.patch('/verify', verifyUser, verifyAccount);

export default router;
