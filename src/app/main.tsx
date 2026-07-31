import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../styles/globals.css'

// Apply theme on load
const savedTheme = localStorage.getItem('crytto-theme');
if (savedTheme && savedTheme !== 'default') {
  const savedCustomColors = localStorage.getItem('crytto-custom-colors');
  if (savedTheme === 'custom' && savedCustomColors) {
    const customColors = JSON.parse(savedCustomColors);
    const root = document.documentElement;
    Object.entries(customColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value as string);
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)