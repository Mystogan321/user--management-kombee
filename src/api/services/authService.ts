import api from '../axios';
import { LoginCredentials, User } from '../../types';

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },
  
  getCurrentUser: (): Omit<User, 'password'> | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService;