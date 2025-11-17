import { Request, Response } from 'express';
import db from '../db.js';

// Interface pour les projets
interface Project {
  id: string;
  title: string;
  image?: string;
  sector?: string;
  description?: string;
  status?: string;
  budget?: string;
  duration?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
}

// Récupérer tous les projets
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const result = await db.query(`
      SELECT p.*, 
             u1.nom as created_by_nom, 
             u1.prenom as created_by_prenom,
             u2.nom as updated_by_nom, 
             u2.prenom as updated_by_prenom
      FROM projects p
      LEFT JOIN utilisateurs u1 ON p.created_by = u1.id
      LEFT JOIN utilisateurs u2 ON p.updated_by = u2.id
      ORDER BY p.created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets'
    });
  }
};

// Récupérer un projet par ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT p.*, 
             u1.nom as created_by_nom, 
             u1.prenom as created_by_prenom,
             u2.nom as updated_by_nom, 
             u2.prenom as updated_by_prenom
      FROM projects p
      LEFT JOIN utilisateurs u1 ON p.created_by = u1.id
      LEFT JOIN utilisateurs u2 ON p.updated_by = u2.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet'
    });
  }
};

// Créer un nouveau projet
export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      id,
      title,
      image,
      sector,
      description,
      status,
      budget,
      duration
    } = req.body;
    
    const userId = (req as any).user?.id;
    
    const result = await db.query(`
      INSERT INTO projects (
        id, title, image, sector, description, status, budget, duration, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [id, title, image, sector, description, status, budget, duration, userId, userId]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Projet créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du projet'
    });
  }
};

// Mettre à jour un projet
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      image,
      sector,
      description,
      status,
      budget,
      duration
    } = req.body;
    
    const userId = (req as any).user?.id;
    
    const result = await db.query(`
      UPDATE projects 
      SET title = $1, image = $2, sector = $3, description = $4, 
          status = $5, budget = $6, duration = $7, updated_by = $8, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [title, image, sector, description, status, budget, duration, userId, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Projet mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du projet'
    });
  }
};

// Supprimer un projet
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du projet'
    });
  }
};

// Statistiques des projets
export const getProjectStats = async (req: Request, res: Response) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'En cours' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'Terminé' THEN 1 END) as completed_projects,
        COUNT(CASE WHEN status = 'Planification' THEN 1 END) as planned_projects,
        COUNT(DISTINCT sector) as total_sectors
      FROM projects
    `);
    
    res.json({
      success: true,
      data: stats.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// Upload d'image pour un projet
export const uploadProjectImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const imageUrl = `http://localhost:3001/uploads/projects/${req.file.filename}`;

    // Mettre à jour l'image du projet
    const result = await db.query(
      'UPDATE projects SET image = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [imageUrl, req.user?.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        image: imageUrl
      },
      message: 'Image uploadée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image'
    });
  }
};