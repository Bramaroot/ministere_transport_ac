import { api } from '@/api';

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
    // Utiliser l'instance axios qui gère automatiquement les tokens et le proxy
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};
