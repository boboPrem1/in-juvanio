// src/components/shared/AnimatedSection.jsx
// Wrapper générique qui applique une animation d'entrée au scroll.
// Si prefers-reduced-motion, le contenu est rendu immédiatement visible.
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './AnimatedSection.module.css';

/**
 * @prop {string}   animation  — 'fadeUp' | 'fadeIn' | 'slideLeft' (défaut: 'fadeUp')
 * @prop {number}   threshold  — fraction visible pour déclencher (défaut: 0.15)
 * @prop {number}   delay      — délai avant déclenchement en ms (défaut: 0)
 * @prop {string}   className  — classes CSS additionnelles
 * @prop {string}   as         — tag HTML à utiliser (défaut: 'div')
 */
export default function AnimatedSection({
  children,
  animation = 'fadeUp',
  threshold = 0.15,
  delay     = 0,
  className = '',
  as: Tag   = 'div',
}) {
  const { ref, isVisible } = useIntersectionReveal({ threshold });

  return (
    <Tag
      ref={ref}
      className={[
        styles.base,
        styles[animation],
        isVisible ? styles.visible : '',
        className,
      ].filter(Boolean).join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
