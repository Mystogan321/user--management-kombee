import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, User } from '../../types';
import authService from '../../api/services/authService';
import { toast } from 'react-toastify';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Check if user is already logged in
const storedUser = localStorage.getItem('user');
const storedAuth = localStorage.getItem('isAuthenticated');

if (storedUser && storedAuth) {
  initialState.user = JSON.parse(storedUser);
  initialState.isAuthenticated = JSON.parse(storedAuth);
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      
      return response.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid email or password';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<Omit<User, 'password'>>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;