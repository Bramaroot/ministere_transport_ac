# Migration: Système de Slugs pour les Actualités

## 📝 Description

Cette migration ajoute le système de slugs aux actualités pour avoir des URLs lisibles et optimisées pour le SEO.

**Exemple:**
- **Avant:** `/actualites/1`
- **Après:** `/actualites/bienvenue-sur-le-portail-numerique`

## 🚀 Déploiement sur le Serveur

### Étape 1: Connexion au serveur

```bash
ssh ansi@votre-serveur.com
cd /home/ansi/websites/transports.gouv.ne
```

### Étape 2: Exécuter la migration SQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql -d ministere_transports_niger

# Exécuter le fichier de migration
\i server/migrations/add_slug_to_actualites.sql

# Ou copier-coller directement le contenu du fichier
```

**Alternative en une seule ligne:**

```bash
sudo -u postgres psql -d ministere_transports_niger -f server/migrations/add_slug_to_actualites.sql
```

### Étape 3: Vérifier que la migration a réussi

```sql
-- Vérifier que la colonne slug existe
\d actualites

-- Voir les slugs générés
SELECT id, titre, slug FROM actualites ORDER BY id;

-- Quitter PostgreSQL
\q
```

### Étape 4: Rebuild et Restart du backend

```bash
npm run build:server
pm2 restart mtac-backend
pm2 logs mtac-backend --lines 50
```

### Étape 5: Build du frontend

```bash
npm run build
```

## ✅ Vérification

### 1. Tester l'API directement

```bash
# Tester avec un slug
curl https://www.transports.gouv.ne/api/news/bienvenue-sur-le-portail-numerique

# Tester avec un ID (doit toujours fonctionner)
curl https://www.transports.gouv.ne/api/news/1
```

### 2. Tester dans le navigateur

1. Aller sur https://www.transports.gouv.ne/actualites
2. Cliquer sur un article
3. Vérifier que l'URL contient le slug au lieu de l'ID
4. Exemple: `/actualites/bienvenue-sur-le-portail-numerique`

## 📊 Ce que fait la migration

1. ✅ Ajoute la colonne `slug` VARCHAR(255)
2. ✅ Crée une fonction PostgreSQL `generate_slug()` pour générer les slugs
3. ✅ Génère automatiquement les slugs pour tous les articles existants
4. ✅ Rend la colonne `slug` obligatoire et unique
5. ✅ Crée un index pour optimiser les performances
6. ✅ Crée un trigger qui génère automatiquement le slug lors de l'insertion/mise à jour

## 🔄 Comportement du trigger

Quand vous créez ou modifiez un article:
- Le slug est généré automatiquement à partir du titre
- Si le slug existe déjà, un compteur est ajouté (`titre-1`, `titre-2`, etc.)
- Exemple:
  - "Bienvenue" → `bienvenue`
  - "Bienvenue" (2ème article) → `bienvenue-1`

## 🔙 Rollback (si nécessaire)

Si vous devez annuler la migration:

```sql
-- Supprimer le trigger
DROP TRIGGER IF EXISTS trigger_auto_slug ON actualites;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS auto_generate_slug();
DROP FUNCTION IF EXISTS generate_slug(text);

-- Supprimer l'index
DROP INDEX IF EXISTS idx_actualites_slug;

-- Supprimer la contrainte unique
ALTER TABLE actualites DROP CONSTRAINT IF EXISTS actualites_slug_unique;

-- Supprimer la colonne
ALTER TABLE actualites DROP COLUMN IF EXISTS slug;
```

## 📝 Notes

- Les anciens liens avec ID continuent de fonctionner (rétrocompatibilité)
- Les nouveaux articles utilisent automatiquement les slugs
- Les slugs sont optimisés pour le SEO (sans accents, minuscules, avec tirets)
- La performance n'est pas impactée grâce à l'index sur la colonne slug
