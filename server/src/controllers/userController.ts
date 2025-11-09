import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

// Récupérer tous les utilisateurs
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nom_utilisateur, email, prenom, nom, role, actif, derniere_connexion, 
       date_creation, date_modification 
       FROM utilisateurs ORDER BY date_creation DESC`
    );
    
    // Laisser le frontend gérer le formatage
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT id, nom_utilisateur, email, prenom, nom, role, actif, derniere_connexion, 
       date_creation, date_modification 
       FROM utilisateurs WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// Créer un nouvel utilisateur
export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, mot_de_passe, prenom, nom, role = 'consultant', actif = true } = req.body;
  const nom_utilisateur = email; // Utiliser l'email comme nom d'utilisateur par défaut

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1 OR nom_utilisateur = $2', 
      [email, nom_utilisateur]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Créer l'utilisateur
    const newUser = await pool.query(
      `INSERT INTO utilisateurs 
       (nom_utilisateur, email, mot_de_passe_hash, prenom, nom, role, actif) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, nom_utilisateur, email, prenom, nom, role, actif, date_creation`,
      [
        nom_utilisateur, 
        email, 
        hashedPassword, 
        prenom, 
        nom, 
        role, 
        actif
      ]
    );

    res.status(201).json({
      success: true,
      data: newUser.rows[0]
    });
  } catch (err: any) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    // Gérer les erreurs de base de données spécifiques si nécessaire
    if (err.code === '23505') { // Violation de contrainte unique
        return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }
    res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { id } = req.params;
  const { email, prenom, nom, role, actif } = req.body;
  // Le nom d'utilisateur est basé sur l'email et ne devrait pas être modifié directement
  const nom_utilisateur = email;

  try {
    // Vérifier si l'utilisateur existe
    const userCheck = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const emailExists = await pool.query(
      'SELECT id FROM utilisateurs WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (emailExists.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé par un autre compte.' });
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await pool.query(
      `UPDATE utilisateurs 
       SET nom_utilisateur = $1, email = $2, prenom = $3, nom = $4, 
           role = $5, actif = $6, date_modification = NOW() 
       WHERE id = $7 
       RETURNING id, nom_utilisateur, email, prenom, nom, role, actif, date_creation, date_modification`,
      [nom_utilisateur, email, prenom, nom, role, actif, id]
    );

    res.json({
      success: true,
      data: updatedUser.rows[0]
    });
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
    if (err.code === '23505') {
        return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Erreur interne du serveur.' 
    });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Vérifier si l'utilisateur existe
    const userCheck = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher la suppression de l'utilisateur admin par défaut
    if (userCheck.rows[0].nom_utilisateur === 'admin') {
      return res.status(403).json({ message: 'La suppression du compte administrateur par défaut n\'est pas autorisée' });
    }

    // Supprimer l'utilisateur
    await pool.query('DELETE FROM utilisateurs WHERE id = $1', [id]);
    
    res.json({ 
      success: true, 
      message: 'Utilisateur supprimé avec succès' 
    });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Désactiver/réactiver un utilisateur
export const toggleUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { actif } = req.body;

  if (typeof actif !== 'boolean') {
    return res.status(400).json({ message: 'Le statut doit être un booléen' });
  }

  try {
    // Vérifier si l'utilisateur existe
    const userCheck = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher la désactivation de l'utilisateur admin par défaut
    if (userCheck.rows[0].nom_utilisateur === 'admin' && actif === false) {
      return res.status(403).json({ message: 'La désactivation du compte administrateur par défaut n\'est pas autorisée' });
    }

    // Mettre à jour le statut de l'utilisateur
    const updatedUser = await pool.query(
      `UPDATE utilisateurs 
       SET actif = $1, date_modification = NOW() 
       WHERE id = $2 
       RETURNING id, nom_utilisateur, email, actif`,
      [actif, id]
    );

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le mot de passe d'un utilisateur
export const updatePassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { mot_de_passe_actuel, nouveau_mot_de_passe } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const userCheck = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userCheck.rows[0];
    
    // Vérifier le mot de passe actuel
    const isMatch = await bcrypt.compare(mot_de_passe_actuel, user.mot_de_passe_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, salt);

    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE utilisateurs SET mot_de_passe_hash = $1, date_modification = NOW() WHERE id = $2',
      [hashedPassword, id]
    );

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du mot de passe:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

