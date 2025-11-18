import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PageLoader from '@/components/PageLoader'; // Import the new PageLoader component

interface AdminRouteProps {
  // No specific props needed for now
}

const AdminRoute: React.FC<AdminRouteProps> = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <PageLoader />; // Show a loader while authentication status is being checked
  }

  if (!isAuthenticated) {
    return <Navigate to="/mtac-dash-login" replace />; // Redirect to login if not authenticated
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />; // Redirect to home if not an admin
  }

  return <Outlet />; // Render the child routes if authenticated and admin
};

export default AdminRoute;
