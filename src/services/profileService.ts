import { api } from '@/api';

export interface Profile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  nom_utilisateur: string;
  role: string;
  actif: boolean;
  date_creation: string;
  date_modification: string;
  derniere_connexion?: string;
  // Champs optionnels qui pourraient ne pas exister
  telephone?: string;
  adresse?: string;
  bio?: string;
  avatar?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export interface UpdateProfileData {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  ancien_mot_de_passe: string;
  nouveau_mot_de_passe: string;
  confirmer_mot_de_passe: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

export const updateProfile = async (profileData: UpdateProfileData): Promise<ProfileResponse> => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

export const changePassword = async (passwordData: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.put('/profile/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw error;
  }
};

export const uploadAvatar = async (file: File): Promise<{ success: boolean; data: { avatar_url: string } }> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/profile/avatar', formData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'avatar:', error);
    throw error;
  }
};
