const API_BASE_URL = 'http://localhost:3001/api';

export interface Tender {
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

export interface TenderFilters {
  page?: number;
  limit?: number;
  statut?: string;
  categorie?: string;
  search?: string;
}

export interface TenderResponse {
  success: boolean;
  data: Tender[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface SingleTenderResponse {
  success: boolean;
  data: Tender;
  message?: string;
}

// Récupérer tous les appels d'offres avec filtres
export const getTenders = async (filters: TenderFilters = {}): Promise<TenderResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.statut && filters.statut !== 'all') queryParams.append('statut', filters.statut);
    if (filters.categorie && filters.categorie !== 'all') queryParams.append('categorie', filters.categorie);
    if (filters.search) queryParams.append('search', filters.search);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tenders?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des appels d\'offres:', error);
    throw error;
  }
};

// Récupérer un appel d'offres par ID
export const getTenderById = async (id: number): Promise<SingleTenderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenders/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'appel d\'offres:', error);
    throw error;
  }
};

// Récupérer les appels d'offres publiés (pour le frontend public)
export const getPublishedTenders = async (filters: TenderFilters = {}): Promise<TenderResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.categorie && filters.categorie !== 'all') queryParams.append('categorie', filters.categorie);

    const response = await fetch(`${API_BASE_URL}/tenders/published?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des appels d\'offres publiés:', error);
    throw error;
  }
};

// Créer un nouvel appel d'offres
export const createTender = async (tenderData: Partial<Tender>, token: string): Promise<SingleTenderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tenderData)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de l\'appel d\'offres:', error);
    throw error;
  }
};

// Mettre à jour un appel d'offres
export const updateTender = async (id: number, tenderData: Partial<Tender>, token: string): Promise<SingleTenderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tenderData)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'appel d\'offres:', error);
    throw error;
  }
};

// Supprimer un appel d'offres
export const deleteTender = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'appel d\'offres:', error);
    throw error;
  }
};

// Formater la date pour l'affichage
export const formatTenderDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formater la date et l'heure pour l'affichage
export const formatTenderDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Obtenir le libellé de la catégorie
export const getTenderCategoryLabel = (categorie: string): string => {
  const categories: { [key: string]: string } = {
    'travaux': 'Travaux',
    'fournitures': 'Fournitures',
    'services': 'Services',
    'consultation': 'Consultation',
    'autre': 'Autre'
  };
  return categories[categorie] || categorie;
};

// Obtenir le libellé du statut
export const getTenderStatusLabel = (statut: string): string => {
  const statuts: { [key: string]: string } = {
    'brouillon': 'Brouillon',
    'publie': 'Publié',
    'en_cours': 'En cours',
    'cloture': 'Clôturé',
    'attribue': 'Attribué',
    'annule': 'Annulé'
  };
  return statuts[statut] || statut;
};

// Formater le montant avec devise
export const formatTenderAmount = (montant?: number, devise: string = 'XOF'): string => {
  if (!montant) return 'Non spécifié';
  
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: devise === 'XOF' ? 'XOF' : 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(montant);
};



