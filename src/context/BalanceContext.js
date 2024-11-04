import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    return parseInt(localStorage.getItem('balance')) || 0;
  });

  const fetchBalance = useCallback(async () => {
    const storedBalance = localStorage.getItem('balance');
    if (storedBalance) {
      setBalance(parseInt(storedBalance));
    } else {
      try {
        const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/balance', {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
        });
        const newBalance = response.data.balance;
        setBalance(newBalance);
        localStorage.setItem('balance', newBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
