import { apiClient } from './client';
import { Unit } from '../types';

export const unitsApi = {
  getAll: async (params?: { grade?: number; semester?: number; category?: string }): Promise<Unit[]> => {
    const response = await apiClient.get('/units', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Unit> => {
    const response = await apiClient.get(`/units/${id}`);
    return response.data;
  },

  getProgress: async (id: string): Promise<{ unitId: string; totalConcepts: number; completedConcepts: number; progress: number }> => {
    const response = await apiClient.get(`/units/${id}/progress`);
    return response.data;
  },
};
