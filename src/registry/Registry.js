// src/registry/Registry.js
import React from 'react';

// ── Blocs de contenu ──────────────────────────────────────────────────────────
const HeroTerminal       = React.lazy(() => import('../components/hero/HeroTerminal'));
const MarqueeBar         = React.lazy(() => import('../components/MarqueeBar'));
const TenxyteShowcase    = React.lazy(() => import('../components/TenxyteShowcase'));
const SkillsServerRack   = React.lazy(() => import('../components/skills/SkillsServerRack'));
const ExperienceTimeline = React.lazy(() => import('../components/experience/ExperienceTimeline'));
const FormationGrid      = React.lazy(() => import('../components/formation/FormationGrid'));
const ContactTerminal    = React.lazy(() => import('../components/contact/ContactTerminal'));

// ── Add-ons (rendus en dehors du <main>) ──────────────────────────────────────
const BootSequenceAddon  = React.lazy(() => import('../components/addons/BootSequenceAddon'));
const CustomCursorAddon  = React.lazy(() => import('../components/addons/CustomCursorAddon'));
const NetworkCanvasAddon = React.lazy(() => import('../components/addons/NetworkCanvasAddon'));

// ── Navigation & structure ────────────────────────────────────────────────────
const Navbar             = React.lazy(() => import('../components/Navbar'));
const ApiViewPanel       = React.lazy(() => import('../components/ApiView'));

/**
 * REGISTRY — catalogue de tous les composants disponibles dans le moteur.
 *
 * Clé  = valeur de skin.architecture[n].component (string, PascalCase)
 * Val  = composant React lazy-loadé
 *
 * RÈGLE : ne jamais supprimer une clé sans migration de base de données.
 * Pour retirer un composant, le marquer @deprecated en commentaire.
 *
 * Variantes futures (pas encore implémentées) :
 *   HeroMinimal    — hero sans canvas, layout monocolonne
 *   SkillsRadar    — radar chart au lieu du server rack
 */
export const REGISTRY = {
  // Blocs de contenu
  HeroTerminal,
  MarqueeBar,
  TenxyteShowcase,
  SkillsServerRack,
  ExperienceTimeline,
  FormationGrid,
  ContactTerminal,

  // Add-ons
  BootSequenceAddon,
  CustomCursorAddon,
  NetworkCanvasAddon,

  // Navigation & structure
  Navbar,
  ApiViewPanel,
};

/**
 * Vérifie qu'un nom de composant est bien enregistré dans le registry.
 * Utile pour les erreurs de dev et la validation Studio.
 *
 * @param {string} componentName
 * @returns {boolean}
 */
export function isRegistered(componentName) {
  return componentName in REGISTRY;
}
