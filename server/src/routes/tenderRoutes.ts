import express from 'express';
import { checkAuth } from '../middleware/auth';
import {
  getAllTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
  getPublishedTenders
} from '../controllers/tenderController';

const router = express.Router();

// Routes publiques
router.get('/published', getPublishedTenders);
router.get('/:id', getTenderById);

// Routes protégées (admin)
router.get('/', checkAuth, getAllTenders);
router.post('/', checkAuth, createTender);
router.put('/:id', checkAuth, updateTender);
router.delete('/:id', checkAuth, deleteTender);

export default router;



