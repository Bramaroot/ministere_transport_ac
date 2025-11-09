const API_BASE_URL = 'http://localhost:3001/api';

export interface StatsResponse {
  success: boolean;
  data: {
    articles: number;
    tenders: number;
    events: number;
    users: number;
    recentArticles: Array<{
      id: number;
      titre: string;
      date_creation: string;
      statut: string;
    }>;
    recentTenders: Array<{
      id: number;
      titre: string;
      date_creation: string;
      statut: string;
    }>;
    recentEvents: Array<{
      id: number;
      titre: string;
      date_creation: string;
      statut: string;
    }>;
  };
}

export const getStats = async (): Promise<StatsResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};
