// src/context/BalanceContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/balance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  useEffect(() => {
    fetchBalance(); // Initial balance fetch when component mounts
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
