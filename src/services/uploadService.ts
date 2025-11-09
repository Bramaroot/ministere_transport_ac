const API_BASE_URL = 'http://localhost:3001/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
  filename?: string;
}

// Validation des fichiers image
export const validateImageFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { valid: false, message: 'Aucun fichier sélectionné' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, message: 'Le fichier est trop volumineux (max 5MB)' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP' };
  }
  
  return { valid: true };
};

// Upload d'image générique
export const uploadImage = async (file: File, token: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const data = await response.json();
    if (data.success && data.imageUrl) {
      return data.imageUrl;
    } else {
      throw new Error(data.message || 'Erreur lors de l\'upload de l\'image');
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    throw error;
  }
};

// Upload d'image pour les actualités
export const uploadNewsImage = async (file: File): Promise<UploadResponse> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Erreur lors de l\'upload de l\'image');
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    throw error;
  }
};

// Upload d'image pour les événements
export const uploadEventImage = async (eventId: number, file: File): Promise<UploadResponse> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/events/${eventId}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Erreur lors de l\'upload de l\'image');
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    throw error;
  }
};

// Upload d'image pour les projets
export const uploadProjectImage = async (projectId: string, file: File): Promise<UploadResponse> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Erreur lors de l\'upload de l\'image');
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    throw error;
  }
};