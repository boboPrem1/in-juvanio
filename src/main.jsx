import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// 1. Base (reset, body, :root, noise overlay)
import './styles/base.css';
// 2. Animations globales (keyframes centralisés)
import './styles/animations.css';
// 3. Utilitaires (btn, two-col, section-label, skeleton, footer)
import './styles/utilities.css';
// Les composants importent leur propre CSS
import App from './App.jsx'

// ── React Query Client ─────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

// ── Validation des seeds (DEV uniquement) ─────────────────
if (import.meta.env.DEV) {
  import('./lib/validateSeed.js').then(({ validateDevSeeds }) => {
    validateDevSeeds();
  });
}

// ── Rendu ──────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
