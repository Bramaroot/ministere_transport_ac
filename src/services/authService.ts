import { api, setAccessToken } from '../api';
// Utiliser le proxy Vite en dev
const API_BASE_URL = '/api';

interface AuthResponse {
  success: boolean;
  token?: string;
  accessToken?: string;
  user: {
    id: number;
    nom_utilisateur: string;
    email: string;
    role: string;
  };
  message?: string;
}

class AuthService {
  private token: string | null = null; // POUR ANCIEN FLUX (admin_token, legacy)

  // Nouveau login standard JWT refresh
  async login(emailOrUsername: string, password: string) {
    const res = await api.post('/auth/login', {
      identifiant: emailOrUsername,
      mot_de_passe: password
    });
    // Prend l'accessToken renvoyé !
    if (res.data.accessToken) {
      setAccessToken(res.data.accessToken);
    }
    return res.data;
  }

  // ANCIEN FLUX: Générer un token admin pour le développement
  async generateAdminToken(): Promise<string> {
    try {
      const response = await api.get('/auth/admin-token');
      const data: AuthResponse = response.data;
      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('admin_token', data.token);
        return data.token;
      } else {
        throw new Error('Erreur lors de la génération du token');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du token admin:', error);
      throw error;
    }
  }

  // Pour l'ancien code (par ex. accès legacy admin)
  async getValidToken(): Promise<string> {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      this.token = storedToken;
      return storedToken;
    }
    // Si pas de token stocké, en générer un nouveau
    return await this.generateAdminToken();
  }

  async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getValidToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('admin_token');
  }
}

export const authService = new AuthService();
