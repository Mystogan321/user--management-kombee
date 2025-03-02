import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, User } from '../../types';

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk for login
export const login = (credentials: LoginCredentials) => async (dispatch: any) => {
  try {
    dispatch(loginStart());
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get users from localStorage or use default admin
    const usersJSON = localStorage.getItem('users');
    const users: User[] = usersJSON ? JSON.parse(usersJSON) : [
      {
        id: '1',
        name: 'Administrator',
        email: 'admin@gmail.com',
        role: 'Administrator',
        status: 'Active',
        password: 'admin123'
      }
    ];
    
    // Find user with matching credentials
    const user = users.find(
      (user) => user.email === credentials.email && user.password === credentials.password
    );
    
    if (user) {
      dispatch(loginSuccess(user));
      return true;
    } else {
      dispatch(loginFailure('Invalid email or password'));
      return false;
    }
  } catch (error) {
    dispatch(loginFailure('An error occurred during login'));
    return false;
  }
};

export default authSlice.reducer;