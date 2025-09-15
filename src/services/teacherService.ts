import { api } from './apiClient';

export interface CreateTeacherRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  schoolId?: string;
}

export interface Teacher {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId: string;
  school?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const teacherService = {
  // Create a new teacher (admin only)
  createTeacher: async (teacherData: CreateTeacherRequest): Promise<{ user: Teacher }> => {
    const response = await api.post('/auth/create-teacher', teacherData);
    return response.data;
  },

  // Get all teachers (admin only)
  getTeachers: async (): Promise<{ users: Teacher[] }> => {
    const response = await api.get('/auth/teachers');
    return response.data;
  }
};
