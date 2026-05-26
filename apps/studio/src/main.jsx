// apps/studio/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './studio.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e2530',
            color:      '#e8eaf0',
            border:     '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'DM Mono', monospace",
            fontSize:   '13px',
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
