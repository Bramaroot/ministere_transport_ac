// Script de test pour l'authentification
export const testAuthentication = () => {
  
  return true;
};

// Fonction pour forcer la connexion (pour les tests)
export const forceLogin = () => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('token', 'admin123');
  localStorage.setItem('user', JSON.stringify({
    id: 1,
    nom_utilisateur: 'admin',
    email: 'admin@transports.gouv.ne',
    role: 'admin'
  }));
  
  
  return true;
};

// Fonction pour nettoyer l'authentification
export const clearAuth = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
};



