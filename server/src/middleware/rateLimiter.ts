import rateLimit from 'express-rate-limit';

// Rate limiter général pour toutes les routes API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limite chaque IP à 200 requêtes par fenêtre de 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Trop de requêtes envoyées depuis cette IP, veuillez réessayer après 15 minutes.',
});

// Rate limiter modéré pour les routes d'authentification (incluant refresh)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Permet les refresh tokens fréquents
  message: 'Trop de tentatives. Veuillez réessayer dans 10 minutes.',
});

// Rate limiter strict pour les routes de connexion/inscription uniquement
export const strictAuthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Limite stricte pour prévenir le brute force
  message: 'Trop de tentatives de connexion. Veuillez réessayer dans une minute.',
});
