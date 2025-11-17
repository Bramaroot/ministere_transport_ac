import { Router } from 'express';
import { checkAuth } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import { getProfile, updateProfile, changePassword, uploadAvatar as uploadAvatarController } from '../controllers/profileController.js';

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
