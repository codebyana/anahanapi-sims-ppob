// src/services/api.js
import axios from 'axios';

let api;

export const configureApi = (store) => {
  api = axios.create({
    baseURL: 'https://api-doc-tht.nutech-integrasi.com',
  });

  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default () => api;
