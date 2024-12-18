import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="912312080557-4ojpif7heq2joidbb5ge17umag0qllbh.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
