import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('userInfo');

interface AuthState {
  user: { email: string; role: string } | null;
  isAuthenticated: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
  } as AuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
