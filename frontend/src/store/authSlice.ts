import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserData } from '../utils/types/auth';

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = {
        ...action.payload,
        expireAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
      };
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
