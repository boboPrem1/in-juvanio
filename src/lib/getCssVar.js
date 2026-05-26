// src/lib/getCssVar.js
// ============================================================
// Lit une CSS custom property depuis :root au moment de l'appel.
// Utilisé par les composants canvas qui ne peuvent pas utiliser var().
// Appelé DANS la boucle d'animation (requestAnimationFrame) pour
// réagir aux changements de thème à chaud sans re-monter le composant.
// ============================================================

/**
 * Lit la valeur actuelle d'une CSS custom property.
 * @param {string} varName - ex: '--accent', '--bg'
 * @returns {string} - la valeur brute (ex: '#00e5c3', 'rgba(0,229,195,0.15)')
 */
export function getCssVar(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

/**
 * Construit un rgba() à partir d'une CSS var contenant une couleur hex.
 * Utilisé pour les canvas qui ont besoin de couleur + alpha dynamique.
 *
 * @param {string} varName - ex: '--canvas-accent-base'
 * @param {number} alpha   - 0.0 → 1.0
 * @returns {string}       - ex: 'rgba(0, 229, 195, 0.15)'
 */
export function getCssVarRgba(varName, alpha) {
  const hex = getCssVar(varName);
  if (!hex || !hex.startsWith('#')) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
