// src/components/shared/BlockSkeleton.jsx
import styles from './BlockSkeleton.module.css';

/**
 * Squelette générique affiché en fallback Suspense pour tout bloc lazy-loadé.
 * @param {number} height - hauteur estimée du bloc (défaut 400px)
 * @param {string} label  - nom du composant attendu (affiché en data-attribute, dev only)
 */
export default function BlockSkeleton({ height = 400, label }) {
  return (
    <div
      className={styles.skeleton}
      style={{ minHeight: height }}
      aria-hidden="true"
      data-component={label}
    >
      <div className={styles.shimmer} />
    </div>
  );
}
