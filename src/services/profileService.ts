const API_BASE_URL = 'http://localhost:3001/api';

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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

export const updateProfile = async (profileData: UpdateProfileData): Promise<ProfileResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

export const changePassword = async (passwordData: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/profile/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      throw new Error('Erreur lors du changement de mot de passe');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw error;
  }
};

export const uploadAvatar = async (file: File): Promise<{ success: boolean; data: { avatar_url: string } }> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'avatar');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'avatar:', error);
    throw error;
  }
};
