import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin.middleware';
import authRoute from './auth.route';
import postRoute from './post.route';
const router = Router();

router.use('/auth', authRoute);
router.use('/post', authMiddleware, isAdmin, postRoute);

export default router;
