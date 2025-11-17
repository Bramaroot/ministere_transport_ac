import { Router } from 'express';
import { checkAuth } from '../middleware/auth.js';
import { validateUser, validateUserUpdate } from '../middleware/userValidation.js';
import { body } from 'express-validator';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updatePassword
} from '../controllers/userController.js';

const router = Router();

// Routes protégées - nécessitent une authentification
router.use(checkAuth);

// Récupérer tous les utilisateurs (admin uniquement)
router.get('/', checkAdmin, getUsers);

// Récupérer un utilisateur par son ID (admin ou l'utilisateur lui-même)
router.get('/:id', checkAdminOrSelf, getUserById);

// Créer un nouvel utilisateur (admin uniquement)
router.post('/', checkAdmin, validateUser, createUser);

// Mettre à jour un utilisateur (admin ou l'utilisateur lui-même)
router.put('/:id', checkAdminOrSelf, validateUserUpdate, updateUser);

// Supprimer un utilisateur (admin uniquement, sauf l'admin principal)
router.delete('/:id', checkAdmin, deleteUser);

// Activer/désactiver un utilisateur (admin uniquement, sauf l'admin principal)
router.patch('/:id/toggle-status', checkAdmin, toggleUserStatus);

// Mettre à jour le mot de passe (l'utilisateur lui-même)
router.post(
  '/:id/update-password',
  [
    body('mot_de_passe_actuel').notEmpty().withMessage('Le mot de passe actuel est requis'),
    body('nouveau_mot_de_passe')
      .isLength({ min: 6 })
      .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
  ],
  updatePassword
);


// Middleware pour vérifier les droits d'administration
function checkAdmin(req: any, res: any, next: any) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
  next();
}

// Middleware pour vérifier si l'utilisateur est admin ou modifie son propre compte
function checkAdminOrSelf(req: any, res: any, next: any) {
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  next();
}

export default router;
