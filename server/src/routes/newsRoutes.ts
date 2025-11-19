import { Router } from 'express';
import {
  getNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController.js';
import { checkAuth } from '../middleware/auth.js';

const router = Router();

// Routes publiques (pas de checkAuth)
router.get('/', getNews);

// Route slug doit être AVANT la route :id pour éviter les conflits
// Si le param contient un tiret, c'est un slug, sinon c'est un ID
router.get('/:identifier', (req, res) => {
  const { identifier } = req.params;

  // Si l'identifier contient un tiret ou des lettres, c'est un slug
  if (identifier.includes('-') || /[a-z]/.test(identifier)) {
    return getNewsBySlug(req, res);
  } else {
    // Sinon c'est un ID numérique
    return getNewsById(req, res);
  }
});

// Routes protégées
router.post('/', checkAuth, createNews);
router.put('/:id', checkAuth, updateNews);
router.delete('/:id', checkAuth, deleteNews);

export default router;
