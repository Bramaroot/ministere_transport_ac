import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PageLoader from '@/components/PageLoader';
import { setAuthInterceptor } from '@/api';

interface AdminRouteProps {
  // No specific props needed for now
}

const AdminRoute: React.FC<AdminRouteProps> = () => {
  // Utilise l'état local pour le chargement, découplé du contexte
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isAuthenticated, isAdmin, checkAuthStatus } = useAuth();

  useEffect(() => {
    // Variable pour éviter les mises à jour d'état sur un composant démonté
    let isMounted = true;
    
    setAuthInterceptor(true);

    const verifyAuth = async () => {
      await checkAuthStatus();
      if (isMounted) {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
      setAuthInterceptor(false);
    };
  }, [checkAuthStatus]);

  // Le rendu utilise l'état de chargement local
  if (isCheckingAuth) {
    return <PageLoader />;
  }

  // Une fois le chargement terminé, isAuthenticated est à jour
  if (!isAuthenticated) {
    return <Navigate to="/mtac-dash-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
