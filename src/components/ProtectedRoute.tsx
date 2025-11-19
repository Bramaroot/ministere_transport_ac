import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Utilise le système refresh token via useAuth()
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Attendre que la vérification d'authentification soit terminée
    if (loading) return;

    // Si pas authentifié, rediriger vers login
    if (!isAuthenticated) {
      navigate('/mtac-dash-login');
      return;
    }

    // Si la route nécessite un admin mais l'utilisateur n'est pas admin
    if (requireAdmin && !isAdmin) {
      navigate('/'); // Rediriger vers la page d'accueil
      return;
    }
  }, [isAuthenticated, isAdmin, loading, navigate, requireAdmin]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si pas authentifié, ne rien afficher (la redirection est en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Si admin requis mais pas admin, ne rien afficher (la redirection est en cours)
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // Tout est bon, afficher le contenu
  return <>{children}</>;
}
