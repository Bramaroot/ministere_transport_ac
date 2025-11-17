import { Router } from 'express';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController.js';
import { checkAuth } from '../middleware/auth.js';

const router = Router();

// Routes publiques (pas de checkAuth)
router.get('/', getNews);
router.get('/:id', getNewsById);

// Routes protégées
router.post('/', checkAuth, createNews);
router.put('/:id', checkAuth, updateNews);
router.delete('/:id', checkAuth, deleteNews);

export default router;
