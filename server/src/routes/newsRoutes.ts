import { Router } from 'express';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController';
import { checkAuth } from '../middleware/auth';

const router = Router();

// Routes publiques (pas de checkAuth)
router.get('/', getNews);
router.get('/:id', getNewsById);

// Routes protégées
router.post('/', checkAuth, createNews);
router.put('/:id', checkAuth, updateNews);
router.delete('/:id', checkAuth, deleteNews);

export default router;
