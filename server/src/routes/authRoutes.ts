import { Router } from 'express';
import { body } from 'express-validator';
import {
  login,
  register,
  getProfile,
  generateAdminToken,
  loginAdminSimple,
  loginAdminWithOTP,
  verifyAdminOTP,
  resendAdminOTP,
  refreshToken,
  logout
} from '../controllers/authController';
import { checkAuth } from '../middleware/auth';

const router = Router();

// Route de connexion
router.post(
  '/login',
  [
    body('identifiant').notEmpty().withMessage('L\'identifiant est requis'),
    body('mot_de_passe').notEmpty().withMessage('Le mot de passe est requis')
  ],
  login
);

// Route d'inscription
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Veuillez fournir un email valide'),
    body('nom_utilisateur')
      .isLength({ min: 3 })
      .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères'),
    body('mot_de_passe')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('prenom').optional().trim(),
    body('nom').optional().trim()
  ],
  register
);

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/profile', checkAuth, getProfile);

// Route temporaire pour générer un token admin (développement uniquement)
router.get('/admin-token', generateAdminToken);

// 🔹 Route de connexion admin simplifiée (sans OTP)
router.post(
  '/admin/login',
  [
    body('identifiant').notEmpty().withMessage('L\'identifiant est requis'),
    body('mot_de_passe').notEmpty().withMessage('Le mot de passe est requis')
  ],
  loginAdminSimple
);

// 🔹 Nouvelles routes pour l'authentification 2FA admin
router.post(
  '/admin/login-otp',
  [
    body('identifiant').notEmpty().withMessage('L\'identifiant est requis'),
    body('mot_de_passe').notEmpty().withMessage('Le mot de passe est requis')
  ],
  loginAdminWithOTP
);

router.post(
  '/admin/verify-otp',
  [
    body('email').isEmail().withMessage('Email valide requis'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Le code doit contenir 6 chiffres')
  ],
  verifyAdminOTP
);

router.post(
  '/admin/resend-otp',
  [
    body('email').isEmail().withMessage('Email valide requis')
  ],
  resendAdminOTP
);

router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
