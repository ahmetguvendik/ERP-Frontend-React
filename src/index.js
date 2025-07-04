import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

function injectDesignVars(design) {
  const root = document.documentElement;
  const colors = design.theme.colors;
  // Renkler
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--success', colors.success);
  root.style.setProperty('--warning', colors.warning);
  root.style.setProperty('--error', colors.error);
  root.style.setProperty('--info', colors.info);
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--surface', colors.surface);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--text-primary', colors.text.primary);
  root.style.setProperty('--text-secondary', colors.text.secondary);
  root.style.setProperty('--text-light', colors.text.light);
  // Tipografi
  const typo = design.theme.typography;
  root.style.setProperty('--font-sans', typo.fontFamily);
  root.style.setProperty('--font-size-base', typo.fontSize.base);
  root.style.setProperty('--font-weight-bold', typo.fontWeight.bold);
  root.style.setProperty('--font-weight-normal', typo.fontWeight.normal);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
