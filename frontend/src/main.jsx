import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tokens.css';     // design system tokens (from the Deskfolio artifact)
import './styles/deskfolio.css';  // design system components (df-*)
import './styles/app.css';        // layout + app-only glue
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
