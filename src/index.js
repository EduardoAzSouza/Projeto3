import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
