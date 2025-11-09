import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { verifyAccess } from '../auth/tokens';
import { JWT_ACCESS_SECRET } from '../auth/auth.config';

// Interface pour l'utilisateur authentifié
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        nom_utilisateur: string;
        email: string;
        role: string;
      };
    }
  }
}

// Clé secrète pour signer les tokens JWT legacy
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_très_longue_et_sécurisée';

// Middleware pour vérifier l'authentification
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token d\'authentification manquant ou invalide' });
    }
    const token = authHeader.split(' ')[1];

    let userId: number | undefined;

    try {
      // Essayer d'abord avec le nouveau système (JWT_ACCESS_SECRET)
      const verified = verifyAccess(token) as any;
      userId = verified.userId || verified.sub;
    } catch (accessError) {
      // Si échec, essayer avec l'ancien système legacy (JWT_SECRET) pour rétrocompatibilité
      try {
        const verifiedLegacy = jwt.verify(token, JWT_SECRET) as any;
        userId = verifiedLegacy.userId || verifiedLegacy.sub;
      } catch (legacyError) {
        return res.status(401).json({ message: 'Token invalide' });
      }
    }

    if (!userId) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Récupérer l'utilisateur depuis la BDD
    const userResult = await pool.query(
      'SELECT id, nom_utilisateur, email, role FROM utilisateurs WHERE id = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur d\'authentification' });
  }
};

// Middleware pour les routes publiques
export const allowPublic = (req: Request, res: Response, next: NextFunction) => {
  next();
};

// Middleware pour vérifier les droits d'administrateur
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est admin ou modifie son propre compte
export const checkAdminOrSelf = (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);

  if (!req.user || (req.user.role !== 'admin' && req.user.id !== userId)) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  next();
};

// Fonction utilitaire pour générer un token JWT
export const generateAuthToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};
