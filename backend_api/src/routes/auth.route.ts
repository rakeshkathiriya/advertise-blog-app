import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import validate from '../middlewares/validate.middleware';
import { userSignupSchema } from '../schemaValidation/userValidation';

const router = Router();

router.route('/register').post(validate(userSignupSchema), register);
router.route('/login').post(login);
router.route('/logout').post(logout);

export default router;
