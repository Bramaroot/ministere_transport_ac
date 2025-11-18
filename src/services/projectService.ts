// Service pour la gestion des projets
import { api } from '@/api';

export interface Project {
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
  created_by_nom?: string;
  created_by_prenom?: string;
}

export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  planned_projects: number;
  total_sectors: number;
}

// Récupérer tous les projets
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get('/projects');

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la récupération des projets');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw error;
  }
};

// Récupérer un projet par ID
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await api.get(`/projects/${id}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Projet non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    throw error;
  }
};

// Créer un nouveau projet
export const createProject = async (project: Omit<Project, 'created_at' | 'updated_at'>): Promise<Project> => {
  try {
    const response = await api.post('/projects', project);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la création du projet');
    }
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    throw error;
  }
};

// Mettre à jour un projet
export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  try {
    const response = await api.put(`/projects/${id}`, project);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la mise à jour du projet');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    throw error;
  }
};

// Supprimer un projet
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/projects/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la suppression du projet');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    throw error;
  }
};

// Récupérer les statistiques des projets
export const getProjectStats = async (): Promise<ProjectStats> => {
  try {
    const response = await api.get('/projects/stats');

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la récupération des statistiques');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};
