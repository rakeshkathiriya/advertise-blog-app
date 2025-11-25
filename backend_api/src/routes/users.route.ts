import { Router } from 'express';
import { changeUserSubscription, getAllUsers } from '../controllers/users.controller';

const router = Router();

router.get('', getAllUsers);
router.patch('/:id', changeUserSubscription);

export default router;
