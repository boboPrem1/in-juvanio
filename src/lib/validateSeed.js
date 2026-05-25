// src/lib/validateSeed.js
// ============================================================
// Validation AJV des seeds de développement au démarrage.
// Exécuté uniquement en mode DEV (import conditionnel dans main.jsx).
// Log les erreurs de schéma dans la console pour un feedback rapide.
// ============================================================

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import skinSchema from '../../packages/schemas/skin.schema.json';
import dataSchema from '../../packages/schemas/data.schema.json';
import localSkin from '../../apps/engine/dev-seeds/skin.json';
import localData from '../../apps/engine/dev-seeds/data.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function validateDevSeeds() {
  const validateSkin = ajv.compile(skinSchema);
  const validateData = ajv.compile(dataSchema);

  const skinValid = validateSkin(localSkin);
  const dataValid = validateData(localData);

  if (!skinValid) {
    console.error('[PortfolioEngine] ❌ skin.json invalide:');
    validateSkin.errors.forEach(e =>
      console.error(`  - ${e.instancePath || '(root)'} ${e.message}`)
    );
  }

  if (!dataValid) {
    console.error('[PortfolioEngine] ❌ data.json invalide:');
    validateData.errors.forEach(e =>
      console.error(`  - ${e.instancePath || '(root)'} ${e.message}`)
    );
  }

  if (skinValid && dataValid) {
    console.log('[PortfolioEngine] ✅ Seeds valides — skin.json + data.json (0 erreur AJV)');
  }
}
