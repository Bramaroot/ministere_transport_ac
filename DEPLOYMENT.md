# Guide de Déploiement - MTAC Niger

Ce guide explique comment déployer l'application Ministère des Transports et de l'Aviation Civile du Niger en production.

## 📋 Prérequis

Avant de déployer, assurez-vous d'avoir :

### Sur le Serveur

- **Système d'exploitation** : Ubuntu 20.04+ ou Debian 11+
- **Node.js** : v18.x ou supérieur
- **PostgreSQL** : v14 ou supérieur
- **Nginx** : v1.18 ou supérieur
- **PM2** : Gestionnaire de processus Node.js
- **Git** : Pour cloner le dépôt
- **Accès root ou sudo** : Pour configurer Nginx et SSL

### Configuration Minimale du Serveur

- **RAM** : 2 GB minimum (4 GB recommandé)
- **CPU** : 2 cœurs minimum
- **Disque** : 20 GB minimum (pour les uploads et logs)
- **Bande passante** : 100 Mbps

### Configuration du Serveur Actuel

- **Domaine** : transports.gouv.ne / www.transports.gouv.ne
- **Utilisateur** : ansi
- **Répertoire** : /home/ansi/websites/transports.gouv.ne
- **Port API** : 4000

## 🚀 Installation Pas à Pas

### Étape 1 : Préparer le Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Installer Nginx
sudo apt install -y nginx

# Installer PM2 globalement
sudo npm install -g pm2

# Installer Git (si non installé)
sudo apt install -y git
```

### Étape 2 : Configurer PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans psql, exécuter :
CREATE DATABASE ministere_transports_niger;
CREATE USER mtac_admin WITH ENCRYPTED PASSWORD 'VotreMotDePasseSecurise';
GRANT ALL PRIVILEGES ON DATABASE ministere_transports_niger TO mtac_admin;
\q
```

### Étape 3 : Cloner le Projet

```bash
# Créer le répertoire de déploiement (si pas déjà fait)
sudo mkdir -p /home/ansi/websites/transports.gouv.ne
sudo chown -R ansi:ansi /home/ansi/websites/transports.gouv.ne

# Cloner le dépôt
cd /home/ansi/websites/transports.gouv.ne
git clone https://github.com/votre-repo/ministere_transport_ac.git .

# Installer les dépendances
npm install --production=false
```

### Étape 4 : Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.exemple .env

# Éditer le fichier .env
nano .env
```

Configurez les variables suivantes :

```env
# Database
DB_USER=mtac_admin
DB_HOST=localhost
DB_NAME=ministere_transports_niger
DB_PASSWORD=VotreMotDePasseSecurise
DB_PORT=5432

# Server
PORT=4000
NODE_ENV=production

# CORS (votre domaine de production)
CORS_ORIGIN=https://transports.gouv.ne,https://www.transports.gouv.ne

# JWT Secrets (générez des valeurs aléatoires sécurisées)
JWT_SECRET=generez_une_longue_chaine_aleatoire_ici_64_caracteres_minimum
JWT_ACCESS_SECRET=autre_chaine_aleatoire_tres_longue_et_securisee
JWT_REFRESH_SECRET=encore_une_autre_chaine_ultra_securisee_et_longue

# Email (pour OTP et notifications)
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

**Important** : Générez des secrets JWT forts avec :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Étape 5 : Initialiser la Base de Données

```bash
# Importer le schéma
PGPASSWORD=VotreMotDePasseSecurise psql -h localhost -U mtac_admin -d ministere_transports_niger -f database/schema.sql
```

### Étape 6 : Build de l'Application

```bash
# Build du frontend et du backend
npm run build:all

# Vérifier que les répertoires de build existent
ls -la dist/
ls -la server/dist/
```

### Étape 7 : Configurer Nginx

```bash
# Éditer la configuration Nginx existante
sudo nano /etc/nginx/sites-available/transports.gouv.ne
```

Mettre à jour avec cette configuration (adaptée de votre config actuelle) :

```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name transports.gouv.ne www.transports.gouv.ne;

    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name transports.gouv.ne www.transports.gouv.ne;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/transports.gouv.ne/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/transports.gouv.ne/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root directory pour le frontend
    root /home/ansi/websites/transports.gouv.ne/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1000;

    # Logs
    access_log /home/ansi/websites/transports.gouv.ne/logs/nginx-access.log;
    error_log /home/ansi/websites/transports.gouv.ne/logs/nginx-error.log;

    # Frontend - SPA routing (Serveur React)
    location / {
        try_files $uri /index.html;
    }

    # API Backend (Node.js)
    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:4000/health;
        proxy_set_header Host $host;
        access_log off;
    }

    # Uploads publics
    location /uploads {
        alias /home/ansi/websites/transports.gouv.ne/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Uploads privés (protégés par l'API)
    location /private_uploads {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Sécurité Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Limiter la taille des uploads
    client_max_body_size 50M;
}
```

Activer le site (si pas déjà fait) :

```bash
# Vérifier si le lien symbolique existe déjà
ls -l /etc/nginx/sites-enabled/transports.gouv.ne

# Si nécessaire, créer le lien symbolique
# sudo ln -s /etc/nginx/sites-available/transports.gouv.ne /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Si SSL est déjà configuré, redémarrer Nginx après la mise à jour
# sudo systemctl restart nginx
```

### Étape 8 : Configurer SSL avec Let's Encrypt

**Note** : Si SSL est déjà configuré sur votre serveur, passez cette étape.

```bash
# Installer Certbot (si pas déjà installé)
sudo apt install -y certbot python3-certbot-nginx

# Obtenir ou renouveler le certificat SSL
sudo certbot --nginx -d transports.gouv.ne -d www.transports.gouv.ne

# Le renouvellement automatique est déjà configuré par Certbot
# Vérifier avec :
sudo certbot renew --dry-run
```

### Étape 9 : Redémarrer Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Étape 10 : Démarrer l'Application avec PM2

```bash
# Depuis le répertoire du projet
cd /home/ansi/websites/transports.gouv.ne

# Démarrer avec PM2
pm2 start ecosystem.config.js --env production

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot (si pas déjà fait)
pm2 startup
# Copier et exécuter la commande affichée
```

### Étape 11 : Vérification

```bash
# Vérifier que PM2 fonctionne
pm2 status

# Voir les logs
pm2 logs mtac-backend

# Tester le health check
curl https://transports.gouv.ne/health

# Tester l'API
curl https://transports.gouv.ne/api/news
```

## 🔄 Mises à Jour et Redéploiement

Pour déployer des mises à jour :

```bash
# Se connecter au serveur
ssh ansi@transports.gouv.ne

# Aller dans le répertoire
cd /home/ansi/websites/transports.gouv.ne

# Récupérer les dernières modifications
git pull origin main

# Utiliser le script de déploiement automatique
npm run deploy
```

Ou manuellement :

```bash
# Installer les nouvelles dépendances
npm install

# Rebuild frontend et backend
npm run build:all

# Recharger PM2 (sans downtime)
pm2 reload mtac-backend

# Redémarrer Nginx si config changée
sudo nginx -t && sudo systemctl reload nginx
```

## 📊 Monitoring et Maintenance

### Logs

```bash
# Logs de l'application
pm2 logs mtac-backend

# Logs Nginx
sudo tail -f /var/log/nginx/mtac-access.log
sudo tail -f /var/log/nginx/mtac-error.log

# Logs PM2
cat logs/pm2-error.log
cat logs/pm2-out.log
```

### Commandes PM2 Utiles

```bash
# Voir le statut
npm run pm2:status

# Redémarrer
npm run pm2:restart

# Arrêter
npm run pm2:stop

# Voir les logs en temps réel
npm run pm2:logs

# Monitorer les ressources
pm2 monit
```

### Backup de la Base de Données

```bash
# Créer un backup
pg_dump -U mtac_admin -h localhost ministere_transports_niger > backup_$(date +%Y%m%d).sql

# Restaurer un backup
psql -U mtac_admin -h localhost ministere_transports_niger < backup_20250115.sql
```

Automatiser les backups avec cron :

```bash
# Éditer crontab
crontab -e

# Ajouter (backup quotidien à 2h du matin)
0 2 * * * pg_dump -U mtac_admin -h localhost ministere_transports_niger > /var/backups/mtac_$(date +\%Y\%m\%d).sql && find /var/backups -name "mtac_*.sql" -mtime +7 -delete
```

## 🔒 Sécurité

### Firewall

```bash
# Installer UFW
sudo apt install -y ufw

# Configurer le firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Mises à Jour de Sécurité

```bash
# Mettre à jour régulièrement
sudo apt update && sudo apt upgrade -y

# Activer les mises à jour automatiques
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
pm2 logs mtac-backend --lines 100

# Vérifier la connexion à la base de données
PGPASSWORD=VotrePassword psql -h localhost -U mtac_admin -d ministere_transports_niger -c "SELECT 1;"

# Vérifier les variables d'environnement
cat .env
```

### Erreurs 502 Bad Gateway

```bash
# Vérifier que l'app est en cours d'exécution
pm2 status

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/mtac-error.log

# Redémarrer PM2
pm2 restart mtac-backend
```

### Performance Lente

```bash
# Vérifier l'utilisation des ressources
pm2 monit

# Vérifier l'espace disque
df -h

# Nettoyer les logs anciens
pm2 flush
```

## 📞 Support

En cas de problème, vérifiez :

1. Les logs PM2 : `pm2 logs`
2. Les logs Nginx : `/var/log/nginx/`
3. L'endpoint health check : `https://votre-domaine.com/health`
4. La connexion à la base de données

## 📝 Checklist de Déploiement

- [ ] Serveur configuré (Node.js, PostgreSQL, Nginx)
- [ ] Base de données créée et initialisée
- [ ] Variables d'environnement configurées (.env)
- [ ] Secrets JWT générés (forts et uniques)
- [ ] CORS_ORIGIN configuré avec le domaine de production
- [ ] Frontend build (`npm run build`)
- [ ] Backend build (`npm run build:server`)
- [ ] Nginx configuré et testé
- [ ] SSL installé (Let's Encrypt)
- [ ] PM2 démarré et sauvegardé
- [ ] Firewall configuré
- [ ] Backups automatiques configurés
- [ ] Health check accessible
- [ ] Tests de l'API effectués

Bonne chance avec votre déploiement ! 🚀
