import { apiClient } from './client';
import { User } from '../types';

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  grade: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
};
