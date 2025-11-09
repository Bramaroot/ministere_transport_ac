import { api } from '../api';

export const submitPermisInternational = async (formData: FormData) => {
  try {
    const response = await api.post('/services/permis-international', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Gérer les erreurs de manière plus détaillée si nécessaire
    console.error("Erreur lors de la soumission du formulaire de permis international:", error);
    throw error;
  }
};

export const getPermisInternationalStatus = async (codeSuivi: string) => {
  try {
    const response = await api.get(`/services/permis-international/status/${codeSuivi}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du statut de la demande:", error);
    throw error;
  }
};
