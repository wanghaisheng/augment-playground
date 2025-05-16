// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Base styles
import './game-theme.css'; // Game-themed styles
import './styles/buttonAnimations.css'; // Button animation styles
import './styles/inkAnimations.css'; // Ink animation styles
import './styles/inputStyles.css'; // Input styles
import './styles/buttonStyles.css'; // Button styles
import './styles/bamboo.css'; // Bamboo planting styles
import './styles/bambooTrading.css'; // Bamboo trading styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);