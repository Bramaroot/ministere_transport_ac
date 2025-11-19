/**
 * Convertit un texte en slug URL-friendly
 * @param text - Le texte à convertir en slug
 * @returns Le slug généré
 *
 * Exemples:
 * slugify("Bienvenue sur le Portail") => "bienvenue-sur-le-portail"
 * slugify("Événement à Niamey") => "evenement-a-niamey"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remplacer les accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remplacer les espaces et caractères spéciaux par des tirets
    .replace(/[^a-z0-9]+/g, '-')
    // Supprimer les tirets multiples consécutifs
    .replace(/-+/g, '-')
    // Supprimer les tirets en début et fin
    .replace(/^-+|-+$/g, '')
    // Limiter à 200 caractères
    .substring(0, 200);
}

/**
 * Génère un slug unique en ajoutant un compteur si nécessaire
 * @param baseSlug - Le slug de base
 * @param existingSlugs - Liste des slugs existants
 * @returns Un slug unique
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
