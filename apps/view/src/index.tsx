import { loadCommons } from '@dash/common';
import 'antd/dist/antd.variable.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root')!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
loadCommons();
