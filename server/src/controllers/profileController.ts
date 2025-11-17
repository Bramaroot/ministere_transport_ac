import { Request, Response } from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';

// Récupérer le profil de l'utilisateur connecté
export const getProfile = async (req: Request, res: Response) => {
  try {
    console.log('Début de la récupération du profil...');
    const userId = req.user?.id;
    console.log('User ID:', userId);
    
    if (!userId) {
      console.log('Utilisateur non authentifié');
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié' 
      });
    }

    console.log('Exécution de la requête SQL...');
    const { rows } = await pool.query(
      `SELECT id, nom_utilisateur, email, prenom, nom, role, actif, 
       derniere_connexion, date_creation, date_modification
       FROM utilisateurs WHERE id = $1`,
      [userId]
    );
    console.log('Résultat de la requête:', rows);

    if (rows.length === 0) {
      console.log('Profil non trouvé');
      return res.status(404).json({ 
        success: false, 
        message: 'Profil non trouvé' 
      });
    }

    console.log('Profil trouvé, envoi de la réponse...');
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du profil:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// Mettre à jour le profil de l'utilisateur connecté
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié' 
      });
    }

    const { nom, prenom, email } = req.body;

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM utilisateurs WHERE email = $1 AND id != $2',
        [email, userId]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cet email est déjà utilisé par un autre utilisateur' 
        });
      }
    }

    // Mettre à jour le profil avec les colonnes existantes uniquement
    const updatedProfile = await pool.query(
      `UPDATE utilisateurs 
       SET nom = COALESCE($1, nom), 
           prenom = COALESCE($2, prenom), 
           email = COALESCE($3, email), 
           date_modification = NOW() 
       WHERE id = $4 
       RETURNING id, nom_utilisateur, email, prenom, nom, role, actif, 
                 derniere_connexion, date_creation, date_modification`,
      [nom, prenom, email, userId]
    );

    res.json({
      success: true,
      data: updatedProfile.rows[0]
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// Changer le mot de passe de l'utilisateur connecté
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié' 
      });
    }

    const { ancien_mot_de_passe, nouveau_mot_de_passe, confirmer_mot_de_passe } = req.body;

    // Vérifier que les nouveaux mots de passe correspondent
    if (nouveau_mot_de_passe !== confirmer_mot_de_passe) {
      return res.status(400).json({ 
        success: false, 
        message: 'Les nouveaux mots de passe ne correspondent pas' 
      });
    }

    // Récupérer l'utilisateur actuel
    const userResult = await pool.query(
      'SELECT mot_de_passe_hash FROM utilisateurs WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(ancien_mot_de_passe, userResult.rows[0].mot_de_passe_hash);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'L\'ancien mot de passe est incorrect' 
      });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, salt);

    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE utilisateurs SET mot_de_passe_hash = $1, date_modification = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (err) {
    console.error('Erreur lors du changement de mot de passe:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// Upload d'avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier fourni' 
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Mettre à jour l'avatar dans la base de données
    await pool.query(
      'UPDATE utilisateurs SET avatar = $1, date_modification = NOW() WHERE id = $2',
      [avatarUrl, userId]
    );

    res.json({
      success: true,
      data: {
        avatar_url: avatarUrl
      }
    });
  } catch (err) {
    console.error('Erreur lors de l\'upload de l\'avatar:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};
