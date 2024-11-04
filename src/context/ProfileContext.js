import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = JSON.parse(localStorage.getItem('profileData'));
    return savedProfile || { firstName: 'User', lastName: '', profileImage: '', email: '' };
  });

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      const response = await axios.get('https://take-home-test-api.nutech-integrasi.com/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 0) {
        const updatedProfile = {
          email: response.data.data.email,
          firstName: response.data.data.first_name,
          lastName: response.data.data.last_name,
          profileImage: response.data.data.profile_image,
        };
        setProfileData(updatedProfile);
        localStorage.setItem('profileData', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  const updateProfile = useCallback(async (updateData) => {
    try {
      const response = await axios.put('https://take-home-test-api.nutech-integrasi.com/profile/update', updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 0) {
        const updatedProfile = {
          ...profileData,
          firstName: response.data.data.first_name,
          lastName: response.data.data.last_name,
        };
        setProfileData(updatedProfile);
        localStorage.setItem('profileData', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, [profileData]);

  const updateProfileImage = useCallback(async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axios.put('https://take-home-test-api.nutech-integrasi.com/profile/image', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 0) {
        const updatedProfile = {
          ...profileData,
          profileImage: response.data.data.profile_image,
        };
        setProfileData(updatedProfile);
        localStorage.setItem('profileData', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  }, [profileData]);

  useEffect(() => {
    if (!profileData.email) {
      fetchProfile();
    }
  }, [fetchProfile, profileData.email]);

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile, updateProfileImage, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
