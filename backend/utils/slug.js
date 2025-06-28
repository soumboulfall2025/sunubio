// Installer slugify avant d'utiliser ce fichier :
// npm install slugify

import slugify from 'slugify';

/**
 * Génère un slug unique basé sur le nom du produit.
 * @param {string} productName - Le nom du produit.
 * @returns {string} Slug unique (minuscule, sans caractères spéciaux, suffixé par un timestamp).
 */
function generateUniqueSlug(productName) {
  const baseSlug = slugify(productName, { lower: true, strict: true });
  const uniqueSuffix = Date.now();
  return `${baseSlug}-${uniqueSuffix}`;
}

export default generateUniqueSlug;
