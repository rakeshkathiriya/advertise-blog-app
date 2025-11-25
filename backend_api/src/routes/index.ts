import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin.middleware';
import authRoute from './auth.route';
import clientRoute from './client.route';
import postRoute from './post.route';
import usersRoute from './users.route';
const router = Router();

router.use('/auth', authRoute);
router.use('/admin', authMiddleware, postRoute);
router.use('/users', authMiddleware, isAdmin, usersRoute);
router.use('/clients', authMiddleware, isAdmin, clientRoute);

export default router;
