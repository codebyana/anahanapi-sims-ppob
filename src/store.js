// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';
import transactionReducer from './features/transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    transaction: transactionReducer,
  },
});

export default store;
