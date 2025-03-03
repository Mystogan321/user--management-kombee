import api from '../axios';
import { User } from '../../types';

const userService = {
  getUsers: async (): Promise<Omit<User, 'password'>[]> => {
    const response = await api.get<Omit<User, 'password'>[]>('/users');
    return response.data;
  },
  
  getUserById: async (id: string): Promise<Omit<User, 'password'>> => {
    const response = await api.get<Omit<User, 'password'>>(`/users/${id}`);
    return response.data;
  },
  
  createUser: async (userData: Omit<User, 'id'>): Promise<Omit<User, 'password'>> => {
    const response = await api.post<Omit<User, 'password'>>('/users', userData);
    return response.data;
  },
  
  updateUser: async (userData: User): Promise<Omit<User, 'password'>> => {
    const response = await api.put<Omit<User, 'password'>>(`/users/${userData.id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
  
  deleteMultipleUsers: async (ids: string[]): Promise<void> => {
    await api.delete('/users/batch', { data: { ids } });
  }
};

export default userService;