import express from 'express';
import authentication from './authentication';
import categories from './categories';

const router = express.Router();

router.use('/auth', authentication);
router.use('/categories', categories);

export default router;
