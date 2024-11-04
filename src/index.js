// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { configureApi } from './services/api'; // Konfigurasi API setelah store

configureApi(store); // Menginisialisasi API dengan store

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
