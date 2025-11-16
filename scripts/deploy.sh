#!/bin/bash

# Script de déploiement pour MTAC Niger
# Ce script automatise le processus de build et de déploiement

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du déploiement MTAC Niger..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Vérifier que nous sommes sur la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    log_warn "Vous n'êtes pas sur la branche 'main' (actuellement sur: $CURRENT_BRANCH)"
    read -p "Continuer quand même ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Vérifier qu'il n'y a pas de changements non commités
if [[ -n $(git status -s) ]]; then
    log_warn "Il y a des changements non commités dans votre dépôt"
    git status -s
    read -p "Continuer quand même ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. Installation des dépendances
log_info "Installation des dépendances..."
npm install --production=false

# 2. Build du frontend et du backend
log_info "Build du frontend et du backend..."
npm run build:all

# Vérifier que les répertoires de build ont été créés
if [ ! -d "dist" ]; then
    log_error "Le répertoire dist n'a pas été créé. Build frontend échoué."
    exit 1
fi

if [ ! -d "server/dist" ]; then
    log_error "Le répertoire server/dist n'a pas été créé. Build backend échoué."
    exit 1
fi

# 3. Vérifier la configuration PM2
if [ ! -f "ecosystem.config.cjs" ]; then
    log_error "Le fichier ecosystem.config.cjs n'existe pas."
    exit 1
fi

# 4. Créer les répertoires nécessaires
log_info "Création des répertoires de logs et uploads..."
mkdir -p logs
mkdir -p server/uploads/{news,avatars,events,projects}
mkdir -p server/private_uploads/{temp,permis_international}

# 5. Vérifier la présence du fichier .env
if [ ! -f ".env" ]; then
    log_error "Le fichier .env n'existe pas. Copiez .env.exemple et configurez-le."
    exit 1
fi

# 6. Vérifier les variables d'environnement critiques
log_info "Vérification des variables d'environnement..."
source .env

REQUIRED_VARS=("DB_USER" "DB_NAME" "DB_PASSWORD" "JWT_SECRET" "JWT_ACCESS_SECRET" "JWT_REFRESH_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    log_error "Variables d'environnement manquantes: ${MISSING_VARS[*]}"
    exit 1
fi

# 7. Tester la connexion à la base de données
log_info "Test de connexion à la base de données..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log_info "Connexion à la base de données réussie"
else
    log_error "Impossible de se connecter à la base de données"
    exit 1
fi

# 8. Redémarrer ou démarrer l'application avec PM2
log_info "Déploiement avec PM2..."

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    log_error "PM2 n'est pas installé. Installez-le avec: npm install -g pm2"
    exit 1
fi

# Vérifier si l'application est déjà en cours d'exécution
if pm2 list | grep -q "mtac-backend"; then
    log_info "Rechargement de l'application..."
    pm2 reload ecosystem.config.cjs --env production
else
    log_info "Démarrage de l'application..."
    pm2 start ecosystem.config.cjs --env production
fi

# Sauvegarder la configuration PM2
pm2 save

log_info "✅ Déploiement terminé avec succès!"
log_info ""
log_info "Commandes utiles:"
log_info "  - Voir les logs: pm2 logs mtac-backend"
log_info "  - Voir le statut: pm2 status"
log_info "  - Redémarrer: pm2 restart mtac-backend"
log_info "  - Arrêter: pm2 stop mtac-backend"
log_info ""
log_info "Health check disponible sur: http://localhost:${PORT:-3001}/health"
