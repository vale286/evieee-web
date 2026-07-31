import React from 'react';
import ReactDOM from 'react-dom/client';
import LevelApp from '../LevelApp';
import '../index.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <LevelApp levelId={5} />
  </React.StrictMode>
);
