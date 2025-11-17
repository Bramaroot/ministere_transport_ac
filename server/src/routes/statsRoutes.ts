import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';
import { checkAuth } from '../middleware/auth.js';

const router = Router();

// Route protégée pour récupérer les statistiques
router.get('/', checkAuth, getStats);

export default router;
