// packages/schemas/skin.zod.ts
// ============================================================
// Schémas Zod du skin — pour le Studio TypeScript (Phase 5)
// Synchronisés avec skin.schema.json
// ============================================================

import { z } from 'zod';

// ── Theme ──────────────────────────────────────────────────

const ThemeTokensSchema = z.object({
  '--bg':       z.string(),
  '--surface':  z.string(),
  '--surface2': z.string(),
  '--accent':   z.string(),
  '--accent2':  z.string(),
  '--accent3':  z.string(),
  '--text':     z.string(),
  '--muted':    z.string(),
  '--border':   z.string(),
  '--glow':     z.string(),
});

// ── Animations ─────────────────────────────────────────────

const AnimationsSchema = z.object({
  parallaxFactor: z.number().min(0).max(1).default(0.3),
  stagger: z.object({
    skillsDelay:     z.number().int().min(0).max(1000).default(150),
    experienceDelay: z.number().int().min(0).max(1000).default(100),
  }).default({}),
  decryptedText: z.object({
    short:  z.number().int().min(0).default(400),
    medium: z.number().int().min(0).default(600),
    long:   z.number().int().min(0).default(900),
    xlong:  z.number().int().min(0).default(1200),
  }).catchall(z.number()).default({}),
}).default({});

// ── Skin root ──────────────────────────────────────────────

export const SkinSchema = z.object({
  theme: z.object({
    light: ThemeTokensSchema,
    dark:  ThemeTokensSchema,
  }),
  typography: z.object({
    '--font-mono':    z.string().default("'DM Mono', monospace"),
    '--font-heading': z.string().default("'Fraunces', serif"),
    '--font-body':    z.string().optional(),
  }).default({}),
  layout: z.object({
    heroReversed:            z.boolean().default(false),
    skillsColumns:           z.number().int().min(1).max(6).default(4),
    '--border-radius-base':  z.string().default('4px'),
    '--border-radius-large': z.string().default('50%'),
    '--hero-gap':            z.string().default('0px'),
  }).default({}),
  animations: AnimationsSchema,
  effects: z.object({
    '--noise-opacity': z.string().default('0.05'),
    '--grid-opacity':  z.string().default('0.6'),
  }).default({}),
  cursor: z.object({
    type: z.enum(['default', 'custom', 'none']).default('default'),
  }).default({}),
  assets: z.object({
    heroPhoto: z.string().optional(),
    favicon:   z.string().optional(),
    cvPdf:     z.string().optional(),
  }).default({}),
  addons: z.object({
    customCursor:  z.boolean().default(false),
    bootSequence:  z.boolean().default(false),
    noiseOverlay:  z.boolean().default(true),
    networkCanvas: z.boolean().default(false),
  }).default({}),
  architecture: z.array(z.object({
    id:        z.string(),
    component: z.string(),
    visible:   z.boolean().default(true),
    props:     z.record(z.unknown()).default({}),
  })).default([]),
});

export type Skin = z.infer<typeof SkinSchema>;

// ── Utilitaire de validation avec logs détaillés ───────────

export function validateSkin(raw: unknown): Skin {
  const result = SkinSchema.safeParse(raw);
  if (!result.success) {
    console.error('[SkinSchema] Erreurs de validation:', result.error.flatten());
    throw new Error('Skin invalide — voir les erreurs ci-dessus');
  }
  return result.data;
}

// ── Schema partiel pour les PATCH du Studio ────────────────

export const SkinPatchSchema = SkinSchema.partial();
export type SkinPatch = z.infer<typeof SkinPatchSchema>;
