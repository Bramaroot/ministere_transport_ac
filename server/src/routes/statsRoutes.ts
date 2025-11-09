import { Router } from 'express';
import { getStats } from '../controllers/statsController';
import { checkAuth } from '../middleware/auth';

const router = Router();

// Route protégée pour récupérer les statistiques
router.get('/', checkAuth, getStats);

export default router;
