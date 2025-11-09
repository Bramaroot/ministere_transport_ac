const API_BASE_URL = 'http://localhost:3001/api';

export interface Event {
  id: number;
  titre: string;
  description?: string;
  date_debut: string;
  lieu: string;
  heure_debut?: string;
  type_evenement: string;
  statut: string;
  image_url?: string;
  created_by?: number;
  updated_by?: number;
  date_creation?: string;
  date_modification?: string;
  created_by_nom?: string;
  created_by_prenom?: string;
  updated_by_nom?: string;
  updated_by_prenom?: string;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  type?: string;
  statut?: string;
  search?: string;
}

export interface EventResponse {
  success: boolean;
  data: Event[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface SingleEventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

// Récupérer tous les événements avec filtres
export const getEvents = async (filters: EventFilters = {}): Promise<EventResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
};

// Récupérer un événement par ID
export const getEventById = async (id: number): Promise<SingleEventResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    throw error;
  }
};

// Récupérer les événements à venir
export const getUpcomingEvents = async (limit: number = 5): Promise<EventResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/upcoming?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des événements à venir:', error);
    throw error;
  }
};

// Créer un nouvel événement
export const createEvent = async (eventData: Partial<Event>, token: string): Promise<SingleEventResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    throw error;
  }
};

// Mettre à jour un événement
export const updateEvent = async (id: number, eventData: Partial<Event>, token: string): Promise<SingleEventResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    throw error;
  }
};

// Supprimer un événement
export const deleteEvent = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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
    console.error('Erreur lors de la suppression de l\'événement:', error);
    throw error;
  }
};

// Formater la date pour l'affichage
export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formater l'heure pour l'affichage
export const formatEventTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

// Obtenir le type d'événement en français
export const getEventTypeLabel = (type: string): string => {
  const types: { [key: string]: string } = {
    'conference': 'Conférence',
    'seminaire': 'Séminaire',
    'formation': 'Formation',
    'reunion': 'Réunion',
    'ceremonie': 'Cérémonie',
    'autre': 'Autre'
  };
  return types[type] || type;
};

// Obtenir le statut en français
export const getEventStatusLabel = (status: string): string => {
  const statuses: { [key: string]: string } = {
    'brouillon': 'Brouillon',
    'publie': 'Publié',
    'annule': 'Annulé',
    'termine': 'Terminé'
  };
  return statuses[status] || status;
};

