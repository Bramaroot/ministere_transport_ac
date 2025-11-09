import { body } from 'express-validator';

export const validateUser = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),

  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  body('prenom')
    .notEmpty().withMessage('Le prénom est requis')
    .trim()
    .isLength({ max: 50 }).withMessage('Le prénom ne peut pas dépasser 50 caractères'),

  body('nom')
    .notEmpty().withMessage('Le nom est requis')
    .trim()
    .isLength({ max: 50 }).withMessage('Le nom ne peut pas dépasser 50 caractères'),

  body('role')
    .optional()
    .isIn(['admin', 'editeur', 'consultant']).withMessage('Rôle invalide'),

  body('actif')
    .optional()
    .isBoolean().withMessage('Le statut doit être un booléen')
];

export const validateUserUpdate = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),

  body('mot_de_passe')
    .optional()
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  body('prenom')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le prénom ne peut pas dépasser 50 caractères'),

  body('nom')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le nom ne peut pas dépasser 50 caractères'),

  body('role')
    .optional()
    .isIn(['admin', 'editeur', 'consultant']).withMessage('Rôle invalide'),

  body('actif')
    .optional()
    .isBoolean().withMessage('Le statut doit être un booléen')
];
