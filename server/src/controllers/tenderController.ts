import { Request, Response } from 'express';
import db from '../db';

// Interface pour les appels d'offres
interface Tender {
  id: number;
  titre: string;
  description: string;
  reference: string;
  categorie: string;
  statut: string;
  montant_budget?: number;
  devise_budget: string;
  date_limite?: string;
  date_publication?: string;
  cree_par?: number;
  date_creation?: string;
  date_modification?: string;
  cree_par_nom?: string;
  cree_par_prenom?: string;
}

// Récupérer tous les appels d'offres
export const getAllTenders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, statut, categorie, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Filtre par statut
    if (statut && statut !== 'all') {
      paramCount++;
      whereClause += ` AND statut = $${paramCount}`;
      queryParams.push(statut);
    }

    // Filtre par catégorie
    if (categorie && categorie !== 'all') {
      paramCount++;
      whereClause += ` AND categorie = $${paramCount}`;
      queryParams.push(categorie);
    }

    // Recherche par titre ou description
    if (search) {
      paramCount++;
      whereClause += ` AND (titre ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Requête principale avec pagination
    const result = await db.query(`
      SELECT ao.*, 
             u.nom as cree_par_nom, 
             u.prenom as cree_par_prenom
      FROM appels_offres ao
      LEFT JOIN utilisateurs u ON ao.cree_par = u.id
      ${whereClause}
      ORDER BY ao.date_creation DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...queryParams, limit, offset]);

    // Compter le total pour la pagination
    const countResult = await db.query(`
      SELECT COUNT(*) as total
      FROM appels_offres ao
      ${whereClause}
    `, queryParams);

    const totalItems = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / Number(limit));

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des appels d\'offres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des appels d\'offres',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer un appel d'offres par ID
export const getTenderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT ao.*, 
             u.nom as cree_par_nom, 
             u.prenom as cree_par_prenom
      FROM appels_offres ao
      LEFT JOIN utilisateurs u ON ao.cree_par = u.id
      WHERE ao.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appel d\'offres non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'appel d\'offres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'appel d\'offres',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Créer un nouvel appel d'offres
export const createTender = async (req: Request, res: Response) => {
  try {
    const {
      titre,
      description,
      reference,
      categorie,
      statut = 'brouillon',
      montant_budget,
      devise_budget = 'XOF',
      date_limite,
      date_publication
    } = req.body;

    // Validation des champs requis
    if (!titre || !description || !reference || !categorie) {
      return res.status(400).json({
        success: false,
        message: 'Les champs titre, description, reference et categorie sont obligatoires'
      });
    }

    const result = await db.query(`
      INSERT INTO appels_offres (
        titre, description, reference, categorie, statut,
        montant_budget, devise_budget, date_limite, date_publication,
        cree_par
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `, [
      titre, description, reference, categorie, statut,
      montant_budget, devise_budget, date_limite, date_publication,
      req.user?.id
    ]);

    res.status(201).json({
      success: true,
      message: 'Appel d\'offres créé avec succès',
      data: result.rows[0]
    });
  } catch (error: any) {
    // Gestion spécifique de la violation de contrainte d'unicité (ex: référence)
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'La création a échoué car un champ unique (comme la référence) existe déjà.'
      });
    }

    console.error('Erreur lors de la création de l\'appel d\'offres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'appel d\'offres',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Mettre à jour un appel d'offres
export const updateTender = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      reference,
      categorie,
      statut,
      montant_budget,
      devise_budget,
      date_limite,
      date_publication
    } = req.body;

    const result = await db.query(`
      UPDATE appels_offres SET
        titre = COALESCE($1, titre),
        description = COALESCE($2, description),
        reference = COALESCE($3, reference),
        categorie = COALESCE($4, categorie),
        statut = COALESCE($5, statut),
        montant_budget = COALESCE($6, montant_budget),
        devise_budget = COALESCE($7, devise_budget),
        date_limite = COALESCE($8, date_limite),
        date_publication = COALESCE($9, date_publication),
        date_modification = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      titre, description, reference, categorie, statut,
      montant_budget, devise_budget, date_limite, date_publication, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appel d\'offres non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Appel d\'offres modifié avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'appel d\'offres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'appel d\'offres',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Supprimer un appel d'offres
export const deleteTender = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      DELETE FROM appels_offres WHERE id = $1 RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appel d\'offres non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Appel d\'offres supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'appel d\'offres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'appel d\'offres',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer les appels d'offres publiés (pour le frontend public)
export const getPublishedTenders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, categorie } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE statut = \'publie\'';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Filtre par catégorie
    if (categorie && categorie !== 'all') {
      paramCount++;
      whereClause += ` AND categorie = $${paramCount}`;
      queryParams.push(categorie);
    }

    const result = await db.query(`
      SELECT ao.*, 
             u.nom as cree_par_nom, 
             u.prenom as cree_par_prenom
      FROM appels_offres ao
      LEFT JOIN utilisateurs u ON ao.cree_par = u.id
      ${whereClause}
      ORDER BY ao.date_publication DESC, ao.date_creation DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...queryParams, limit, offset]);

    // Compter le total pour la pagination
    const countResult = await db.query(`
      SELECT COUNT(*) as total
      FROM appels_offres ao
      ${whereClause}
    `, queryParams);

    const totalItems = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / Number(limit));

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des appels d\'offres publiés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des appels d\'offres publiés',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};



