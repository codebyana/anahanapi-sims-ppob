import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: {
    firstName: '',
    lastName: '',
    email: '',
    profileImage: '/images/Profile_Photo.png',
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData(state, action) {
      state.profileData = action.payload;
    },
    updateProfileImage(state, action) {
      state.profileData.profileImage = action.payload;
    },
  },
});

export const { setProfileData, updateProfileImage } = profileSlice.actions;
export default profileSlice.reducer;
