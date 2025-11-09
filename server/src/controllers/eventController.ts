import { Request, Response } from 'express';
import db from '../db';

// Interface pour les événements (adaptée au nouveau schéma)
interface Event {
  id: number;
  titre: string;
  description?: string;
  date_debut: Date;
  lieu: string;
  heure_debut?: string;
  type_evenement: string;
  statut: string;
  image_url?: string;
  created_by?: number;
  updated_by?: number;
  date_creation?: Date;
  date_modification?: Date;
}

// Récupérer tous les événements
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, statut, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Filtre par type
    if (type && type !== 'all') {
      paramCount++;
      whereClause += ` AND type_evenement = $${paramCount}`;
      queryParams.push(type);
    }

    // Filtre par statut
    if (statut && statut !== 'all') {
      paramCount++;
      whereClause += ` AND statut = $${paramCount}`;
      queryParams.push(statut);
    }

    // Recherche par titre ou description
    if (search) {
      paramCount++;
      whereClause += ` AND (titre ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Requête principale
    const result = await db.query(`
      SELECT e.*, 
             u1.nom as created_by_nom, 
             u1.prenom as created_by_prenom,
             u2.nom as updated_by_nom, 
             u2.prenom as updated_by_prenom
      FROM evenements e
      LEFT JOIN utilisateurs u1 ON e.created_by = u1.id
      LEFT JOIN utilisateurs u2 ON e.updated_by = u2.id
      ${whereClause}
      ORDER BY e.date_debut DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...queryParams, Number(limit), offset]);

    // Compter le total
    const countResult = await db.query(`
      SELECT COUNT(*) as total
      FROM evenements e
      ${whereClause}
    `, queryParams);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer un événement par ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT e.*, 
             u1.nom as created_by_nom, 
             u1.prenom as created_by_prenom,
             u2.nom as updated_by_nom, 
             u2.prenom as updated_by_prenom
      FROM evenements e
      LEFT JOIN utilisateurs u1 ON e.created_by = u1.id
      LEFT JOIN utilisateurs u2 ON e.updated_by = u2.id
      WHERE e.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Créer un nouvel événement
export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      titre,
      description,
      date_debut,
      lieu,
      heure_debut,
      type_evenement,
      statut = 'brouillon',
      image_url
    } = req.body;

    // Validation des champs requis
    if (!titre || !date_debut || !lieu) {
      return res.status(400).json({
        success: false,
        message: 'Les champs titre, date_debut et lieu sont obligatoires'
      });
    }

    const result = await db.query(`
      INSERT INTO evenements (
        titre, description, date_debut, lieu, heure_debut,
        type_evenement, statut, image_url, created_by, updated_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $9
      ) RETURNING *
    `, [
      titre, description, date_debut, lieu, heure_debut,
      type_evenement, statut, image_url, req.user?.id
    ]);

    res.status(201).json({
      success: true,
      message: 'Événement créé avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Mettre à jour un événement
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      date_debut,
      lieu,
      heure_debut,
      type_evenement,
      statut,
      image_url
    } = req.body;

    const result = await db.query(`
      UPDATE evenements SET
        titre = COALESCE($2, titre),
        description = COALESCE($3, description),
        date_debut = COALESCE($4, date_debut),
        lieu = COALESCE($5, lieu),
        heure_debut = COALESCE($6, heure_debut),
        type_evenement = COALESCE($7, type_evenement),
        statut = COALESCE($8, statut),
        image_url = COALESCE($9, image_url),
        updated_by = $10,
        date_modification = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [
      id, titre, description, date_debut, lieu, heure_debut,
      type_evenement, statut, image_url, req.user?.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Événement mis à jour avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'événement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Supprimer un événement
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      DELETE FROM evenements 
      WHERE id = $1 
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer les événements à venir
export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;

    const result = await db.query(`
      SELECT e.*, 
             u1.nom as created_by_nom, 
             u1.prenom as created_by_prenom
      FROM evenements e
      LEFT JOIN utilisateurs u1 ON e.created_by = u1.id
      WHERE e.statut = 'publie' 
        AND e.date_debut > CURRENT_TIMESTAMP
      ORDER BY e.date_debut ASC
      LIMIT $1
    `, [limit]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements à venir:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements à venir',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Upload d'image pour un événement
export const uploadEventImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const imageUrl = `http://localhost:3001/uploads/events/${req.file.filename}`;

    // Mettre à jour l'image de l'événement
    const result = await db.query(
      'UPDATE evenements SET image_url = $1, updated_by = $2, date_modification = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [imageUrl, req.user?.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        image_url: imageUrl
      },
      message: 'Image uploadée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

