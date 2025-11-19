import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAccessToken } from '@/api'; // Importer setAccessToken

interface User {
  id: number;
  nom_utilisateur: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken); // Mettre à jour le token dans l'instance api
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'admin');
  };

  const logout = () => {
    setAccessToken(null); // Effacer le token de l'instance api
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    // Optionally, call backend logout endpoint
    api.post('/auth/logout').catch(error => console.error('Logout failed:', error));
    navigate('/mtac-dash-login'); // Redirect to new login page
  };

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      // 1. Essayer d'obtenir un nouveau access token via le refresh token (cookie)
      const refreshResponse = await api.post('/auth/refresh');
      const newAccessToken = refreshResponse.data.accessToken;

      // 2. Mettre à jour le token dans l'instance axios
      setAccessToken(newAccessToken);

      // 3. Maintenant récupérer le profil avec le nouveau token
      const profileResponse = await api.get('/profile');
      // Le backend retourne { success: true, data: {...} }
      const userData = profileResponse.data.data;

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'admin');
    } catch (error: any) {
      // Ne logger que les vraies erreurs (pas 401 qui signifie "pas connecté")
      if (error?.response?.status !== 401) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      }
      // L'utilisateur n'est pas connecté ou le refresh token est expiré
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, loading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
