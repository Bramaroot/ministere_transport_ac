import { Router } from 'express';
import { checkAuth } from '../middleware/auth';
import { uploadAvatar } from '../middleware/upload';
import { getProfile, updateProfile, changePassword, uploadAvatar as uploadAvatarController } from '../controllers/profileController';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(checkAuth);

// Récupérer le profil de l'utilisateur connecté
router.get('/', getProfile);

// Mettre à jour le profil de l'utilisateur connecté
router.put('/', updateProfile);

// Changer le mot de passe de l'utilisateur connecté
router.put('/password', changePassword);

// Upload d'avatar
router.post('/avatar', uploadAvatar, uploadAvatarController);

export default router;
