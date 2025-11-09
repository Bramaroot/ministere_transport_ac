-- Schéma de la base de données pour le portail du Ministère des Transports du Niger
-- Créé le : 16/10/2025
-- Version : 2.0 - Schéma complet avec toutes les fonctionnalités

-- Suppression des tables si elles existent déjà (attention, cela va supprimer toutes les données)
DROP TABLE IF EXISTS demandes_services CASCADE;
DROP TABLE IF EXISTS documents_services CASCADE;
DROP TABLE IF EXISTS appels_offres CASCADE;
DROP TABLE IF EXISTS documents_appels_offres CASCADE;
DROP TABLE IF EXISTS actualites CASCADE;
DROP TABLE IF EXISTS evenements CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS sessions_utilisateurs CASCADE;
DROP TABLE IF EXISTS parametres_systeme CASCADE;
DROP TABLE IF EXISTS logs_audit CASCADE;

-- Suppression des types énumérés
DROP TYPE IF EXISTS role_utilisateur CASCADE;
DROP TYPE IF EXISTS type_service CASCADE;
DROP TYPE IF EXISTS statut_service CASCADE;
DROP TYPE IF EXISTS statut_appel_offre CASCADE;
DROP TYPE IF EXISTS categorie_appel_offre CASCADE;
DROP TYPE IF EXISTS type_document CASCADE;
DROP TYPE IF EXISTS action_audit CASCADE;

-- Création des types énumérés
CREATE TYPE role_utilisateur AS ENUM ('admin', 'editeur', 'consultant');
CREATE TYPE type_service AS ENUM (
  'permis_conduire', 
  'permis_international', 
  'homologation_vehicule',
  'carte_grise_internationale',
  'demande_homologation_simple',
  'demande_transformation_vehicule',
  'permis_exploitation_ligne_transport',
  'autorisation_transport_marchandises',
  'autorisation_transport_personnes',
  'agrement_transport_produits_strategiques',
  'mise_en_gage_vehicule',
  'lien_anac'
);
CREATE TYPE statut_service AS ENUM ('brouillon', 'soumis', 'en_cours', 'approuve', 'rejete', 'termine');
CREATE TYPE statut_appel_offre AS ENUM ('brouillon', 'publie', 'ferme', 'attribue', 'annule');
CREATE TYPE categorie_appel_offre AS ENUM ('infrastructures', 'aviation_civile', 'securite_routiere', 'equipements', 'services');
CREATE TYPE type_document AS ENUM ('identite', 'photo', 'certificat_medical', 'attestation_formation', 'justificatif_domicile', 'facture_vehicule', 'certificat_douane', 'certificat_origine', 'certificat_conformite', 'photos_vehicule', 'permis_national', 'justificatif_voyage', 'document_appel_offre', 'autre');
CREATE TYPE action_audit AS ENUM ('creer', 'lire', 'modifier', 'supprimer', 'connexion', 'deconnexion', 'exporter');
CREATE TYPE statut_evenement AS ENUM ('brouillon', 'publie', 'annule', 'termine');
CREATE TYPE type_evenement AS ENUM ('conference', 'seminaire', 'formation', 'reunion', 'ceremonie', 'autre');

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    prenom VARCHAR(50),
    nom VARCHAR(50),
    role role_utilisateur NOT NULL DEFAULT 'consultant',
    actif BOOLEAN DEFAULT true,
    authentification_double_facteur_activee BOOLEAN DEFAULT false,
    secret_authentification_double_facteur VARCHAR(255),
    derniere_connexion TIMESTAMP WITH TIME ZONE,
   
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commentaires sur la table utilisateurs
COMMENT ON TABLE utilisateurs IS 'Table des utilisateurs du portail d''administration';
COMMENT ON COLUMN utilisateurs.role IS 'Rôle de l''utilisateur (admin, editeur, consultant)';
COMMENT ON COLUMN utilisateurs.actif IS 'Indique si le compte est actif ou désactivé';
COMMENT ON COLUMN utilisateurs.authentification_double_facteur_activee IS 'Indique si l''authentification à deux facteurs est activée';
COMMENT ON COLUMN utilisateurs.secret_authentification_double_facteur IS 'Secret pour l''authentification à deux facteurs';

-- Création des index pour la table utilisateurs
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX idx_utilisateurs_date_creation ON utilisateurs(date_creation);

-- Table des sessions utilisateur
CREATE TABLE sessions_utilisateurs (
    id SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    token_session VARCHAR(255) UNIQUE NOT NULL,
    date_expiration TIMESTAMP WITH TIME ZONE NOT NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE sessions_utilisateurs IS 'Table des sessions utilisateur pour la gestion de l''authentification';
CREATE INDEX idx_sessions_utilisateurs_token ON sessions_utilisateurs(token_session);
CREATE INDEX idx_sessions_utilisateurs_id_utilisateur ON sessions_utilisateurs(id_utilisateur);
CREATE INDEX idx_sessions_utilisateurs_date_expiration ON sessions_utilisateurs(date_expiration);

-- Table des actualités
CREATE TABLE actualites (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    url_image VARCHAR(255),
    active BOOLEAN DEFAULT false,
    cree_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commentaires sur la table actualites
COMMENT ON TABLE actualites IS 'Table contenant les actualités et articles de presse du portail du Ministère des Transports du Niger';

-- Création des index pour la table actualites
CREATE INDEX idx_actualites_date_creation ON actualites(date_creation DESC);
CREATE INDEX idx_actualites_cree_par ON actualites(cree_par);
CREATE INDEX idx_actualites_active ON actualites(active);

-- Table des appels d'offres
CREATE TABLE appels_offres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    categorie categorie_appel_offre NOT NULL,
    statut statut_appel_offre DEFAULT 'brouillon',
    montant_budget DECIMAL(15,2),
    devise_budget VARCHAR(3) DEFAULT 'XOF',
    date_limite TIMESTAMP WITH TIME ZONE,
    date_publication TIMESTAMP WITH TIME ZONE,
    cree_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE appels_offres IS 'Table des appels d''offres et marchés publics';
COMMENT ON COLUMN appels_offres.reference IS 'Référence unique de l''appel d''offres';
COMMENT ON COLUMN appels_offres.categorie IS 'Catégorie de l''appel d''offres';
COMMENT ON COLUMN appels_offres.statut IS 'Statut de l''appel d''offres';
COMMENT ON COLUMN appels_offres.montant_budget IS 'Montant du budget en devise locale';
COMMENT ON COLUMN appels_offres.devise_budget IS 'Devise (XOF pour FCFA)';

CREATE INDEX idx_appels_offres_statut ON appels_offres(statut);
CREATE INDEX idx_appels_offres_categorie ON appels_offres(categorie);
CREATE INDEX idx_appels_offres_date_limite ON appels_offres(date_limite);
CREATE INDEX idx_appels_offres_date_creation ON appels_offres(date_creation DESC);
CREATE INDEX idx_appels_offres_reference ON appels_offres(reference);

-- Table des documents d\'appels d'offres
CREATE TABLE documents_appels_offres (
    id SERIAL PRIMARY KEY,
    id_appel_offre INTEGER REFERENCES appels_offres(id) ON DELETE CASCADE,
    nom_document VARCHAR(255) NOT NULL,
    url_document VARCHAR(500) NOT NULL,
    type_document type_document DEFAULT 'document_appel_offre',
    taille_fichier INTEGER,
    type_mime VARCHAR(100),
    telecharge_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE documents_appels_offres IS 'Table des documents associés aux appels d''offres';
CREATE INDEX idx_documents_appels_offres_id_appel_offre ON documents_appels_offres(id_appel_offre);
CREATE INDEX idx_documents_appels_offres_type ON documents_appels_offres(type_document);

-- Table des projets
CREATE TABLE projets (
    id SERIAL PRIMARY KEY,
    nom_projet VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type_projet type_projet NOT NULL,
    statut statut_projet DEFAULT 'planifie',
    priorite priorite_projet DEFAULT 'normale',
    budget_estime DECIMAL(15,2),
    budget_reel DECIMAL(15,2),
    devise_budget VARCHAR(3) DEFAULT 'XOF',
    date_debut_prevue DATE,
    date_fin_prevue DATE,
    date_debut_reelle DATE,
    date_fin_reelle DATE,
    pourcentage_avancement INTEGER DEFAULT 0 CHECK (pourcentage_avancement >= 0 AND pourcentage_avancement <= 100),
    responsable_projet INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    equipe_projet INTEGER[] DEFAULT '{}', -- Array des IDs des utilisateurs de l'équipe
    localisation VARCHAR(255),
    objectifs TEXT,
    livrables TEXT,
    risques TEXT,
    notes TEXT,
    cree_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commentaires sur la table projets
COMMENT ON TABLE projets IS 'Table des projets du Ministère des Transports';
COMMENT ON COLUMN projets.type_projet IS 'Type de projet (infrastructure, aviation, sécurité routière, etc.)';
COMMENT ON COLUMN projets.statut IS 'Statut actuel du projet';
COMMENT ON COLUMN projets.priorite IS 'Priorité du projet (faible, normale, élevée, critique)';
COMMENT ON COLUMN projets.budget_estime IS 'Budget estimé du projet';
COMMENT ON COLUMN projets.budget_reel IS 'Budget réel dépensé';
COMMENT ON COLUMN projets.pourcentage_avancement IS 'Pourcentage d''avancement du projet (0-100)';
COMMENT ON COLUMN projets.responsable_projet IS 'Responsable principal du projet';
COMMENT ON COLUMN projets.equipe_projet IS 'IDs des membres de l''équipe projet';
COMMENT ON COLUMN projets.objectifs IS 'Objectifs du projet';
COMMENT ON COLUMN projets.livrables IS 'Livrables attendus';
COMMENT ON COLUMN projets.risques IS 'Risques identifiés';

-- Création des index pour la table projets
CREATE INDEX idx_projets_type ON projets(type_projet);
CREATE INDEX idx_projets_statut ON projets(statut);
CREATE INDEX idx_projets_priorite ON projets(priorite);
CREATE INDEX idx_projets_responsable ON projets(responsable_projet);
CREATE INDEX idx_projets_date_debut_prevue ON projets(date_debut_prevue);
CREATE INDEX idx_projets_date_fin_prevue ON projets(date_fin_prevue);
CREATE INDEX idx_projets_date_creation ON projets(date_creation DESC);
CREATE INDEX idx_projets_pourcentage_avancement ON projets(pourcentage_avancement);

-- Table des étapes des projets
CREATE TABLE projets_etapes (
    id SERIAL PRIMARY KEY,
    id_projet INTEGER REFERENCES projets(id) ON DELETE CASCADE,
    nom_etape VARCHAR(255) NOT NULL,
    description TEXT,
    statut statut_etape DEFAULT 'planifiee',
    ordre_etape INTEGER NOT NULL,
    date_debut_prevue DATE,
    date_fin_prevue DATE,
    date_debut_reelle DATE,
    date_fin_reelle DATE,
    pourcentage_avancement INTEGER DEFAULT 0 CHECK (pourcentage_avancement >= 0 AND pourcentage_avancement <= 100),
    responsable_etape INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    livrables_etape TEXT,
    notes TEXT,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commentaires sur la table projets_etapes
COMMENT ON TABLE projets_etapes IS 'Table des étapes des projets';
COMMENT ON COLUMN projets_etapes.ordre_etape IS 'Ordre d''exécution de l''étape dans le projet';
COMMENT ON COLUMN projets_etapes.statut IS 'Statut de l''étape';
COMMENT ON COLUMN projets_etapes.pourcentage_avancement IS 'Pourcentage d''avancement de l''étape (0-100)';
COMMENT ON COLUMN projets_etapes.responsable_etape IS 'Responsable de l''étape';
COMMENT ON COLUMN projets_etapes.livrables_etape IS 'Livrables spécifiques à cette étape';

-- Création des index pour la table projets_etapes
CREATE INDEX idx_projets_etapes_id_projet ON projets_etapes(id_projet);
CREATE INDEX idx_projets_etapes_statut ON projets_etapes(statut);
CREATE INDEX idx_projets_etapes_ordre ON projets_etapes(id_projet, ordre_etape);
CREATE INDEX idx_projets_etapes_responsable ON projets_etapes(responsable_etape);
CREATE INDEX idx_projets_etapes_date_debut_prevue ON projets_etapes(date_debut_prevue);
CREATE INDEX idx_projets_etapes_date_fin_prevue ON projets_etapes(date_fin_prevue);

-- Table des documents des projets
CREATE TABLE projets_documents (
    id SERIAL PRIMARY KEY,
    id_projet INTEGER REFERENCES projets(id) ON DELETE CASCADE,
    id_etape INTEGER REFERENCES projets_etapes(id) ON DELETE CASCADE,
    nom_document VARCHAR(255) NOT NULL,
    url_document VARCHAR(500) NOT NULL,
    type_document type_document DEFAULT 'autre',
    taille_fichier INTEGER,
    type_mime VARCHAR(100),
    version VARCHAR(20) DEFAULT '1.0',
    description TEXT,
    telecharge_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commentaires sur la table projets_documents
COMMENT ON TABLE projets_documents IS 'Table des documents associés aux projets et étapes';
COMMENT ON COLUMN projets_documents.id_etape IS 'ID de l''étape si le document est spécifique à une étape (NULL si document général du projet)';
COMMENT ON COLUMN projets_documents.version IS 'Version du document';
COMMENT ON COLUMN projets_documents.description IS 'Description du document';

-- Création des index pour la table projets_documents
CREATE INDEX idx_projets_documents_id_projet ON projets_documents(id_projet);
CREATE INDEX idx_projets_documents_id_etape ON projets_documents(id_etape);
CREATE INDEX idx_projets_documents_type ON projets_documents(type_document);
CREATE INDEX idx_projets_documents_date_creation ON projets_documents(date_creation DESC);

-- Table des demandes de services
CREATE TABLE demandes_services (
    id SERIAL PRIMARY KEY,
    numero_demande VARCHAR(50) UNIQUE NOT NULL,
    type_service type_service NOT NULL,
    statut statut_service DEFAULT 'brouillon',
    
    -- Informations du demandeur
    prenom_demandeur VARCHAR(100) NOT NULL,
    nom_demandeur VARCHAR(100) NOT NULL,
    email_demandeur VARCHAR(100) NOT NULL,
    telephone_demandeur VARCHAR(20) NOT NULL,
    adresse_demandeur TEXT,
    profession_demandeur VARCHAR(100),
    nationalite_demandeur VARCHAR(50) DEFAULT 'nigerienne',
    date_naissance_demandeur DATE,
    lieu_naissance_demandeur VARCHAR(100),
    
    -- Informations spécifiques au service
    donnees_service JSONB, -- Données spécifiques selon le type de service
    
    -- Informations de paiement
    montant_paiement DECIMAL(10,2),
    devise_paiement VARCHAR(3) DEFAULT 'XOF',
    statut_paiement VARCHAR(20) DEFAULT 'en_attente',
    reference_paiement VARCHAR(100),
    
    -- Suivi
    assigne_a INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    notes TEXT,
    date_completion TIMESTAMP WITH TIME ZONE,
    
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE demandes_services IS 'Table des demandes de services (permis, homologation, etc.)';
COMMENT ON COLUMN demandes_services.numero_demande IS 'Numéro unique de la demande';
COMMENT ON COLUMN demandes_services.type_service IS 'Type de service demandé';
COMMENT ON COLUMN demandes_services.statut IS 'Statut de la demande';
COMMENT ON COLUMN demandes_services.donnees_service IS 'Données spécifiques au service (JSON)';
COMMENT ON COLUMN demandes_services.statut_paiement IS 'Statut du paiement (en_attente, paye, echec, rembourse)';

CREATE INDEX idx_demandes_services_type ON demandes_services(type_service);
CREATE INDEX idx_demandes_services_statut ON demandes_services(statut);
CREATE INDEX idx_demandes_services_email_demandeur ON demandes_services(email_demandeur);

-- Table des événements
CREATE TABLE evenements (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
    date_fin TIMESTAMP WITH TIME ZONE,
    lieu VARCHAR(200) NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    type_evenement type_evenement DEFAULT 'autre',
    statut statut_evenement DEFAULT 'brouillon',
    image_url VARCHAR(500),
    organisateur VARCHAR(200),
    contact_email VARCHAR(100),
    contact_telephone VARCHAR(20),
    nombre_places INTEGER,
    prix DECIMAL(10,2),
    devise VARCHAR(3) DEFAULT 'XOF',
    informations_supplementaires TEXT,
    
    -- Métadonnées
    created_by INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE evenements IS 'Table des événements du ministère';
COMMENT ON COLUMN evenements.titre IS 'Titre de l\'événement';
COMMENT ON COLUMN evenements.description IS 'Description détaillée de l\'événement';
COMMENT ON COLUMN evenements.date_debut IS 'Date et heure de début de l\'événement';
COMMENT ON COLUMN evenements.date_fin IS 'Date et heure de fin de l\'événement';
COMMENT ON COLUMN evenements.lieu IS 'Lieu où se déroule l\'événement';
COMMENT ON COLUMN evenements.heure_debut IS 'Heure de début (si différent de date_debut)';
COMMENT ON COLUMN evenements.heure_fin IS 'Heure de fin (si différent de date_fin)';
COMMENT ON COLUMN evenements.type_evenement IS 'Type d\'événement (conférence, séminaire, etc.)';
COMMENT ON COLUMN evenements.statut IS 'Statut de l\'événement';
COMMENT ON COLUMN evenements.organisateur IS 'Nom de l\'organisateur';
COMMENT ON COLUMN evenements.nombre_places IS 'Nombre de places disponibles';
COMMENT ON COLUMN evenements.prix IS 'Prix de participation (0 si gratuit)';

-- Index pour les événements
CREATE INDEX idx_evenements_date_debut ON evenements(date_debut);
CREATE INDEX idx_evenements_statut ON evenements(statut);
CREATE INDEX idx_evenements_type ON evenements(type_evenement);
CREATE INDEX idx_evenements_lieu ON evenements(lieu);
CREATE INDEX idx_demandes_services_date_creation ON demandes_services(date_creation DESC);
CREATE INDEX idx_demandes_services_numero ON demandes_services(numero_demande);
CREATE INDEX idx_demandes_services_assigne_a ON demandes_services(assigne_a);

-- Table des documents des demandes de services
CREATE TABLE documents_services (
    id SERIAL PRIMARY KEY,
    id_demande_service INTEGER REFERENCES demandes_services(id) ON DELETE CASCADE,
    nom_document VARCHAR(255) NOT NULL,
    url_document VARCHAR(500) NOT NULL,
    type_document type_document NOT NULL,
    taille_fichier INTEGER,
    type_mime VARCHAR(100),
    requis BOOLEAN DEFAULT true,
    date_telechargement TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE documents_services IS 'Table des documents associés aux demandes de services';
CREATE INDEX idx_documents_services_id_demande ON documents_services(id_demande_service);
CREATE INDEX idx_documents_services_type ON documents_services(type_document);

-- Table des paramètres système
CREATE TABLE parametres_systeme (
    id SERIAL PRIMARY KEY,
    cle_parametre VARCHAR(100) UNIQUE NOT NULL,
    valeur_parametre TEXT,
    type_parametre VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    public BOOLEAN DEFAULT false,
    modifie_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE parametres_systeme IS 'Table des paramètres de configuration du système';
CREATE INDEX idx_parametres_systeme_cle ON parametres_systeme(cle_parametre);
CREATE INDEX idx_parametres_systeme_public ON parametres_systeme(public);

-- Table des projets
CREATE TABLE projects (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    sector VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'En cours',
    budget VARCHAR(100),
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- Commentaires sur la table projects
COMMENT ON TABLE projects IS 'Table des projets du Ministère des Transports';
COMMENT ON COLUMN projects.id IS 'Identifiant unique du projet';
COMMENT ON COLUMN projects.title IS 'Titre du projet';
COMMENT ON COLUMN projects.image IS 'URL de l''image principale du projet';
COMMENT ON COLUMN projects.sector IS 'Secteur du projet (Transport Terrestre, Aviation Civile, Infrastructures)';
COMMENT ON COLUMN projects.description IS 'Description détaillée du projet';
COMMENT ON COLUMN projects.status IS 'Statut actuel du projet';
COMMENT ON COLUMN projects.budget IS 'Budget du projet';
COMMENT ON COLUMN projects.duration IS 'Durée du projet';
COMMENT ON COLUMN projects.created_by IS 'Utilisateur qui a créé le projet';
COMMENT ON COLUMN projects.updated_by IS 'Utilisateur qui a modifié le projet en dernier';

-- Création des index pour la table projects
CREATE INDEX idx_projects_sector ON projects(sector);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_updated_by ON projects(updated_by);

-- Table des logs d'audit
CREATE TABLE logs_audit (
    id SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    action action_audit NOT NULL,
    nom_table VARCHAR(50),
    id_enregistrement INTEGER,
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    adresse_ip INET,
    user_agent TEXT,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE logs_audit IS 'Table des logs d''audit pour tracer les actions des utilisateurs';
CREATE INDEX idx_logs_audit_id_utilisateur ON logs_audit(id_utilisateur);
CREATE INDEX idx_logs_audit_action ON logs_audit(action);
CREATE INDEX idx_logs_audit_nom_table ON logs_audit(nom_table);
CREATE INDEX idx_logs_audit_date_creation ON logs_audit(date_creation DESC);

-- Données initiales
-- Insertion de l'utilisateur administrateur par défaut
-- Mot de passe: admin123 (à changer après la première connexion)
INSERT INTO utilisateurs (
    nom_utilisateur, 
    email, 
    mot_de_passe_hash, 
    prenom, 
    nom, 
    role, 
    actif
) VALUES (
    'admin',
    'ibrahimking719@gmail.com',
    '$2b$10$6BpF5J5Lhq3L7V9q8vZr7e0bX1vQ4wYk1Xx8cDvXKJmN2lZ1XyZz', -- bcrypt hash de 'admin123'
    'Administrateur',
    'Système',
    'admin',
    true
) ON CONFLICT (nom_utilisateur) DO NOTHING;
 
- 

-- Fonction pour mettre à jour automatiquement le champ date_modification
CREATE OR REPLACE FUNCTION mettre_a_jour_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer un numéro de demande unique
CREATE OR REPLACE FUNCTION generer_numero_demande(type_service_param type_service)
RETURNS VARCHAR(50) AS $$
DECLARE
    prefixe VARCHAR(10);
    partie_annee VARCHAR(4);
    numero_sequence INTEGER;
    numero_demande VARCHAR(50);
BEGIN
    -- Définir le préfixe selon le type de service
    CASE type_service_param
        WHEN 'permis_conduire' THEN prefixe := 'PC';
        WHEN 'permis_international' THEN prefixe := 'PI';
        WHEN 'homologation_vehicule' THEN prefixe := 'HV';
        ELSE prefixe := 'SR';
    END CASE;
    
    -- Année courante
    partie_annee := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    
    -- Obtenir le prochain numéro de séquence pour cette année
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_demande FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO numero_sequence
    FROM demandes_services
    WHERE numero_demande LIKE prefixe || partie_annee || '%';
    
    -- Construire le numéro de demande
    numero_demande := prefixe || partie_annee || LPAD(numero_sequence::VARCHAR, 6, '0');
    
    RETURN numero_demande;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer une référence d'appel d'offres
CREATE OR REPLACE FUNCTION generer_reference_appel_offre()
RETURNS VARCHAR(100) AS $$
DECLARE
    partie_annee VARCHAR(4);
    numero_sequence INTEGER;
    reference VARCHAR(100);
BEGIN
    -- Année courante
    partie_annee := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    
    -- Obtenir le prochain numéro de séquence pour cette année
    SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO numero_sequence
    FROM appels_offres
    WHERE reference LIKE 'AO/MTAC/' || partie_annee || '/%';
    
    -- Construire la référence
    reference := 'AO/MTAC/' || partie_annee || '/' || LPAD(numero_sequence::VARCHAR, 3, '0');
    
    RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- Déclencheurs pour mettre à jour automatiquement les champs date_modification
CREATE TRIGGER mettre_a_jour_utilisateurs_date_modification
BEFORE UPDATE ON utilisateurs
FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_date_modification();

CREATE TRIGGER mettre_a_jour_actualites_date_modification
BEFORE UPDATE ON actualites
FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_date_modification();

CREATE TRIGGER mettre_a_jour_appels_offres_date_modification
BEFORE UPDATE ON appels_offres
FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_date_modification();

CREATE TRIGGER mettre_a_jour_demandes_services_date_modification
BEFORE UPDATE ON demandes_services
FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_date_modification();

CREATE TRIGGER mettre_a_jour_parametres_systeme_date_modification
BEFORE UPDATE ON parametres_systeme
FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_date_modification();

-- Déclencheur pour générer automatiquement le numéro de demande
CREATE OR REPLACE FUNCTION definir_numero_demande()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_demande IS NULL OR NEW.numero_demande = '' THEN
        NEW.numero_demande := generer_numero_demande(NEW.type_service);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER definir_numero_demande_trigger
BEFORE INSERT ON demandes_services
FOR EACH ROW EXECUTE FUNCTION definir_numero_demande();

-- Déclencheur pour générer automatiquement la référence d'appel d'offres
CREATE OR REPLACE FUNCTION definir_reference_appel_offre()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference IS NULL OR NEW.reference = '' THEN
        NEW.reference := generer_reference_appel_offre();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER definir_reference_appel_offre_trigger
BEFORE INSERT ON appels_offres
FOR EACH ROW EXECUTE FUNCTION definir_reference_appel_offre();

-- Vues utiles
CREATE OR REPLACE VIEW vue_liste_utilisateurs AS
SELECT 
    id,
    nom_utilisateur,
    email,
    prenom,
    nom,
    role,
    actif,
    authentification_double_facteur_activee,
    derniere_connexion,
    date_creation,
    date_modification
FROM utilisateurs
ORDER BY date_creation DESC;

CREATE OR REPLACE VIEW vue_liste_actualites AS
SELECT 
    a.id,
    a.titre,
    SUBSTRING(a.contenu, 1, 100) || '...' AS extrait,
    a.url_image,
    a.active,
    u.nom_utilisateur AS nom_utilisateur_auteur,
    u.prenom AS prenom_auteur,
    u.nom AS nom_auteur,
    a.date_creation,
    a.date_modification
FROM actualites a
LEFT JOIN utilisateurs u ON a.cree_par = u.id
ORDER BY a.date_creation DESC;

CREATE OR REPLACE VIEW vue_liste_appels_offres AS
SELECT 
    ao.id,
    ao.titre,
    ao.description,
    ao.reference,
    ao.categorie,
    ao.statut,
    ao.montant_budget,
    ao.devise_budget,
    ao.date_limite,
    ao.date_publication,
    u.nom_utilisateur AS nom_utilisateur_cree_par,
    u.prenom AS prenom_cree_par,
    u.nom AS nom_cree_par,
    ao.date_creation,
    ao.date_modification
FROM appels_offres ao
LEFT JOIN utilisateurs u ON ao.cree_par = u.id
ORDER BY ao.date_creation DESC;
  

  -- Table pour les demandes de permis de conduire international
CREATE TABLE IF NOT EXISTS demandes_permis_international (
    id SERIAL PRIMARY KEY,
    code_suivi TEXT UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'en_attente', -- ex: en_attente, en_cours_de_traitement, approuvee, rejetee
    
    -- Chemins vers les fichiers uploadés
    path_demande_manuscrite TEXT,
    path_timbre_fiscal TEXT,
    path_copie_permis_national TEXT,
    path_copie_ancien_permis TEXT, -- Optionnel
    paths_photos_identite JSONB, -- Pour stocker les chemins des deux photos

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Créer un trigger pour mettre à jour automatiquement 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger si la table existe
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'demandes_permis_international') THEN
      CREATE TRIGGER update_demandes_permis_international_updated_at
      BEFORE UPDATE ON demandes_permis_international
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
   END IF;
END;
$$;

-- Ajout d'index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_code_suivi ON demandes_permis_international(code_suivi);
CREATE INDEX IF NOT EXISTS idx_status ON demandes_permis_international(status);

COMMENT ON COLUMN demandes_permis_international.path_copie_ancien_permis IS 'Ce champ est optionnel, car tout le monde n''a pas un ancien permis international.';
COMMENT ON COLUMN demandes_permis_international.paths_photos_identite IS 'Stocke un tableau JSON des chemins vers les photos d''identité. ex: ["path/to/photo1.jpg", "path/to/photo2.jpg"]';


CREATE OR REPLACE VIEW vue_statistiques_tableau_bord AS
SELECT 
    (SELECT COUNT(*) FROM utilisateurs WHERE actif = true) AS total_utilisateurs,
    (SELECT COUNT(*) FROM actualites WHERE active = true) AS total_actualites,
    (SELECT COUNT(*) FROM appels_offres WHERE statut = 'publie') AS appels_offres_actifs,
    (SELECT COUNT(*) FROM demandes_services WHERE statut IN ('soumis', 'en_cours')) AS demandes_en_attente,
    (SELECT COUNT(*) FROM demandes_services WHERE statut = 'termine' AND DATE(date_completion) = CURRENT_DATE) AS terminees_aujourd_hui,
    (SELECT COUNT(*) FROM demandes_services WHERE DATE(date_creation) = CURRENT_DATE) AS demandes_aujourd_hui;

-- Droits d'accès
-- À adapter selon votre configuration de sécurité
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO votre_utilisateur_db;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO votre_utilisateur_db;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO votre_utilisateur_db;
--# Attention : Cela supprimera toutes les données existantes
-- psql -U postgres -c "DROP DATABASE IF EXISTS votre_base_de_donnees;"
-- psql -U postgres -c "CREATE DATABASE votre_base_de_donnees;"
-- psql -U postgres -d votre_base_de_donnees -f d:\FounndersHub\niger-transport-hub\database\schema.sql