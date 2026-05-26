// src/components/shared/AnimatedSection.jsx
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import styles from './AnimatedSection.module.css';

/**
 * Wrapper qui applique une animation d'entrée (fade + slide) au scroll.
 * Si prefers-reduced-motion, le contenu est rendu immédiatement sans animation.
 *
 * @prop {string}   animation  — 'fadeUp' | 'fadeIn' | 'slideLeft' (défaut: 'fadeUp')
 * @prop {number}   threshold  — fraction visible pour déclencher (défaut: 0.15)
 * @prop {number}   delay      — délai avant déclenchement en ms (défaut: 0)
 * @prop {string}   as         — tag HTML (défaut: 'div')
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
