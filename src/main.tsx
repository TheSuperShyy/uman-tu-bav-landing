import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Always start at the top on refresh. Browsers default to "auto" scroll
// restoration which jumps you back to where you were before reload —
// usually annoying for a single-page landing, especially when paired
// with the splash screen (you'd see the splash then immediately scroll
// past it). Opt into manual control and force the top.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
