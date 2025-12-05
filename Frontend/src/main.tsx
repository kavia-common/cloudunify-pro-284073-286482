import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import { AuthProvider } from './store/auth';

// React 18 root render
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
