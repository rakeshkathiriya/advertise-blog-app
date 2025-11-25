import { Router } from 'express';
import {
  createClient,
  deleteClient,
  getAllClient,
  getFilteredClient,
  updateClient,
} from '../controllers/clients.controller';

const router = Router();

router.post('', createClient);
router.get('', getAllClient);
router.get('/dropdown', getFilteredClient);
router.patch('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
