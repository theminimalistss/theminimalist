import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/ui/styles/fonts.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@/ui/styles/tokens.css';
import '@/ui/styles/global.css';
import '@/ui/styles/hero.css';
import '@/ui/styles/hero-responsive.css';
import '@/ui/styles/work.css';
import '@/ui/styles/dialog.css';
import '@/ui/styles/loader.css';
import '@/ui/styles/site.css';
import '@/ui/styles/pages.css';
import '@/ui/styles/motion.css';
import App from '@/App';

const root = document.getElementById('root');
if (!root) throw new Error('The application root is missing.');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
