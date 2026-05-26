// src/components/addons/NoiseOverlayAddon.jsx
// Le noise overlay est géré entièrement via CSS (body::after dans base.css).
// injectCssVariables() injecte --noise-opacity: 0 quand skin.addons.noiseOverlay === false.
// Ce composant est un no-op React — il doit exister pour que l'entrée
// "NoiseOverlayAddon" dans skin.architecture soit valide dans le Registry.
export default function NoiseOverlayAddon() {
  return null;
}
