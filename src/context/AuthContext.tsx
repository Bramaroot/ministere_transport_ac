import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAccessToken } from '@/api';

interface User {
  id: number;
  nom_utilisateur: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  const navigate = useNavigate();

  const login = useCallback((accessToken: string, userData: User) => {
    setAccessToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'admin');
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    api.post('/auth/logout').catch(error => console.error('Logout failed:', error));
    navigate('/mtac-dash-login');
  }, [navigate]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const refreshResponse = await api.post('/auth/refresh');
      const newAccessToken = refreshResponse.data.accessToken;
      setAccessToken(newAccessToken);

      const profileResponse = await api.get('/profile');
      const userData = profileResponse.data.data;

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'admin');
    } catch (error: any) {
      if (error?.response?.status !== 401) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      }
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    // Le 'finally' et le setLoading(false) ont été supprimés.
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, checkAuthStatus }}>
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
