// src/components/Transactions/Transaction.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BalanceContext } from '../../context/BalanceContext';
import Header from '../Dashboard/Header';
import BalanceCard from '../Dashboard/BalanceCard';
import './Transaction.css';

const Transaction = () => {
  const { balance, fetchBalance } = useContext(BalanceContext);
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: 'User',
    lastName: '',
    profileImage: '/images/Profile_Photo.PNG', // Hardcoded default avatar
  });
  const [showBalance, setShowBalance] = useState(false);
  const limit = 5;

  useEffect(() => {
    fetchBalance();
    fetchTransactionHistory();

    // Load profile data from localStorage on mount
    const loadProfileData = () => {
      const savedProfile = JSON.parse(localStorage.getItem('profileData'));
      if (savedProfile) {
        setProfileData(savedProfile);
      }
    };

    loadProfileData();

    // Listen for storage changes to update profile data if modified elsewhere
    window.addEventListener('storage', loadProfileData);

    return () => {
      window.removeEventListener('storage', loadProfileData);
    };
  }, [offset, fetchBalance]);

  const fetchTransactionHistory = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Token tidak ditemukan. Silakan login kembali.');
      return;
    }

    try {
      const response = await axios.get(`https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 0 && response.data.data.records.length > 0) {
        setTransactions((prevTransactions) => [...prevTransactions, ...response.data.data.records]);

        if (response.data.data.records.length < limit) {
          setHasMore(false);
        }
      } else if (response.data.status === 0 && response.data.data.records.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  // Function to toggle balance visibility
  const toggleBalanceVisibility = () => setShowBalance(!showBalance);

  return (
    <div className="transaction">
      <Header />
      <div className="welcome-section">
        <div className="profile-info">
          <img
            src={profileData.profileImage || '/images/Profile_Photo.PNG'} // Fallback image if profileImage is empty
            alt="User Avatar"
            className="profile-avatar"
            onError={(e) => { e.target.src = '/images/Profile_Photo.PNG'; }} // Fallback in case of broken image link
          />
          <div className="welcome-text">
            <p>Selamat datang,</p>
            <p className="profile-name">{profileData.firstName} {profileData.lastName}</p>
          </div>
        </div>
        <BalanceCard balance={balance} showBalance={showBalance} toggleBalance={toggleBalanceVisibility} />
      </div>

      <h3>Semua Transaksi</h3>
      <div className="transaction-list">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-item">
            <div className="transaction-left">
              <div className={`amount ${transaction.transaction_type === 'TOPUP' ? 'positive' : 'negative'}`}>
                {transaction.transaction_type === 'TOPUP' ? `+ Rp${transaction.total_amount.toLocaleString('id-ID')}` : `- Rp${transaction.total_amount.toLocaleString('id-ID')}`}
              </div>
              <div className="transaction-date-time">
                <p>{new Date(transaction.created_on).toLocaleDateString('id-ID')}</p>
                <p>{new Date(transaction.created_on).toLocaleTimeString('id-ID')}</p>
              </div>
            </div>
            <div className="transaction-type">
              <p>{transaction.description}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button onClick={() => setOffset(offset + limit)} className="show-more-button">
          Show more
        </button>
      )}
    </div>
  );
};

export default Transaction;
