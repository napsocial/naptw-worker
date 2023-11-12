import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import App from './App.tsx';

import "./index.css";

const ga = !location.pathname.match("encryption") && "G-MSENQ0VVLY";
if (ga) ReactGA.initialize(ga);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
