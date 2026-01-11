import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { DMS } from './DMS';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DMS />
  </StrictMode>,
);
