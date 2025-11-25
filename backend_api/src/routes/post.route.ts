import { Router } from 'express';

import { createAdvertise, deleteAdvertise, getAllAdvertise } from '../controllers/post.controller';

import { isAdmin } from '../middlewares/isAdmin.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.get('/advertisements', getAllAdvertise);
router.post('/advertisements', isAdmin, upload.single('image'), createAdvertise);
router.delete('/:id/advertisements', isAdmin, deleteAdvertise);
export default router;
