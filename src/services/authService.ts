import { api, setAccessToken } from '../api';

interface AuthResponse {
  success: boolean;
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
  /**
   * Connexion standard avec refresh token
   * Le backend retourne un accessToken et envoie le refreshToken via cookie HttpOnly
   */
  async login(emailOrUsername: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/login', {
      identifiant: emailOrUsername,
      mot_de_passe: password
    });

    // Mettre à jour l'accessToken dans l'intercepteur axios
    if (res.data.accessToken) {
      setAccessToken(res.data.accessToken);
    }

    return res.data;
  }

  /**
   * Déconnexion - révoque le refresh token côté serveur
   * et nettoie l'accessToken côté client
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  }
}

export const authService = new AuthService();
