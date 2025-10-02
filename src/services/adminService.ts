import apiClient from './apiClient';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER';
  schoolId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    name: string;
  };
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER';
  schoolId?: string;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER';
  isActive: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  teachers: number;
  admins: number;
}

export const adminService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<{ success: boolean; data: User[]; count: number }> {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  // Obtener estadísticas de usuarios
  async getUserStats(): Promise<{ success: boolean; data: UserStats }> {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  // Crear nuevo usuario
  async createUser(userData: CreateUserData): Promise<{ success: boolean; data: User; message: string }> {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  // Actualizar usuario
  async updateUser(userId: string, userData: UpdateUserData): Promise<{ success: boolean; data: User; message: string }> {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Desactivar usuario
  async deactivateUser(userId: string): Promise<{ success: boolean; data: User; message: string }> {
    const response = await apiClient.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  }
};
