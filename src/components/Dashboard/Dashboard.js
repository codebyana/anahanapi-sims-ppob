// src/components/Dashboard/Dashboard.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { BalanceContext } from '../../context/BalanceContext';
import Header from './Header';
import BalanceCard from './BalanceCard';
import ServiceList from './ServiceList';
import PromoSlider from './PromoSlider';
import './Dashboard.css';

const Dashboard = () => {
  const { balance, fetchBalance } = useContext(BalanceContext);
  const [showBalance, setShowBalance] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'User',
    lastName: '',
    profileImage: '',
  });

  useEffect(() => {
    // Check if profile data is in localStorage
    const savedProfile = JSON.parse(localStorage.getItem('profileData'));
    
    if (savedProfile) {
      setProfileData(savedProfile);
    } else {
      // Fetch profile data from API if not available in localStorage
      fetchProfileData();
    }

    // Load balance from localStorage or fetch from API
    const savedBalance = localStorage.getItem('balance');
    if (savedBalance) {
      fetchBalance();
    } else {
      fetchBalance();
    }
  }, [fetchBalance]);

  // Fetch profile data from API
  const fetchProfileData = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Token tidak ditemukan. Silakan login kembali.');
      return;
    }

    try {
      const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { email, first_name, last_name, profile_image } = response.data.data;
      const updatedProfile = {
        email,
        firstName: first_name,
        lastName: last_name,
        profileImage: profile_image || '', // Use the profile image URL from the response
      };

      setProfileData(updatedProfile);
      localStorage.setItem('profileData', JSON.stringify(updatedProfile)); // Persist profile data in localStorage

    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Gagal memuat profil. Silakan coba lagi.');
    }
  };

  const toggleBalanceVisibility = () => setShowBalance(!showBalance);

  return (
    <div className="dashboard">
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
      <ServiceList />
      <PromoSlider />
    </div>
  );
};

export default Dashboard;
