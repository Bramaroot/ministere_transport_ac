-- Migration: Ajouter le système de slugs aux actualités
-- Date: 2025-11-19

-- 1. Ajouter la colonne slug
ALTER TABLE actualites
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- 2. Créer une fonction pour générer des slugs
CREATE OR REPLACE FUNCTION generate_slug(text TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convertir en minuscules
    slug := LOWER(text);

    -- Remplacer les caractères accentués
    slug := TRANSLATE(slug,
        'àáâãäåāăąèéêëēĕėęěìíîïīĭįìòóôõöōŏőùúûüūŭůűųñçćĉċčĎďĐÞþßÆæŒœ',
        'aaaaaaaaaeeeeeeeeeiiiiiiioooooooouuuuuuuuuncccccdddtpssaeaeoeoe'
    );

    -- Remplacer les espaces et caractères spéciaux par des tirets
    slug := REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g');

    -- Supprimer les tirets en début et fin
    slug := TRIM(BOTH '-' FROM slug);

    -- Limiter la longueur à 200 caractères
    slug := SUBSTRING(slug FROM 1 FOR 200);

    RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Générer les slugs pour les articles existants
UPDATE actualites
SET slug = generate_slug(titre) || '-' || id
WHERE slug IS NULL OR slug = '';

-- 4. Rendre la colonne slug obligatoire et unique
ALTER TABLE actualites
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE actualites
ADD CONSTRAINT actualites_slug_unique UNIQUE (slug);

-- 5. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_actualites_slug ON actualites(slug);

-- 6. Créer un trigger pour générer automatiquement le slug lors de l'insertion
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 1;
    slug_exists BOOLEAN;
BEGIN
    -- Si le slug n'est pas fourni, le générer
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := generate_slug(NEW.titre);
        new_slug := base_slug;

        -- Vérifier l'unicité et ajouter un compteur si nécessaire
        LOOP
            SELECT EXISTS(SELECT 1 FROM actualites WHERE slug = new_slug AND id != COALESCE(NEW.id, 0))
            INTO slug_exists;

            EXIT WHEN NOT slug_exists;

            new_slug := base_slug || '-' || counter;
            counter := counter + 1;
        END LOOP;

        NEW.slug := new_slug;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_auto_slug ON actualites;
CREATE TRIGGER trigger_auto_slug
    BEFORE INSERT OR UPDATE OF titre ON actualites
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_slug();

-- Afficher le résultat
SELECT
    id,
    titre,
    slug,
    CASE
        WHEN slug IS NOT NULL AND slug != '' THEN '✅'
        ELSE '❌'
    END as status
FROM actualites
ORDER BY id;
