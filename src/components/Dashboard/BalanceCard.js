// src/components/Dashboard/BalanceCard.js
import React from 'react';
import './BalanceCard.css';

const BalanceCard = ({ balance, showBalance, toggleBalance }) => {
  return (
    <div className="balance-card">
      <p className="balance-label">Saldo anda</p>
      <p className="balance-amount">
        {showBalance ? `Rp ${balance ? balance.toLocaleString('id-ID') : '0'}` : 'Rp ••••••••'}
      </p>
      <button onClick={toggleBalance} className="balance-button">
        {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}
      </button>
    </div>
  );
};

export default BalanceCard;
