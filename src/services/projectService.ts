// Service pour la gestion des projets
const API_BASE_URL = '/api/projects';

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
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Erreur lors de la récupération des projets');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw error;
  }
};

// Récupérer un projet par ID
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Projet non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    throw error;
  }
};

// Créer un nouveau projet
export const createProject = async (project: Omit<Project, 'created_at' | 'updated_at'>): Promise<Project> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(project)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Erreur lors de la création du projet');
    }
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    throw error;
  }
};

// Mettre à jour un projet
export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(project)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Erreur lors de la mise à jour du projet');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    throw error;
  }
};

// Supprimer un projet
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Erreur lors de la suppression du projet');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    throw error;
  }
};

// Récupérer les statistiques des projets
export const getProjectStats = async (): Promise<ProjectStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};
