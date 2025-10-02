import { api } from './apiClient';
import { 
  Class, 
  ClassWithDetails, 
  CreateClassRequest, 
  UpdateClassRequest,
  AddStudentsToClassRequest,
  PaginatedResponse 
} from '@/types/api';

export const classesService = {
  // Get all classes for the current user
  getClasses: async (page = 1, limit = 10): Promise<PaginatedResponse<Class>> => {
    return api.get(`/classes?page=${page}&limit=${limit}`);
  },

  // Get a specific class by ID
  getClassById: async (id: string): Promise<ClassWithDetails> => {
    return api.get(`/classes/${id}`);
  },

  // Create a new class
  createClass: async (classData: CreateClassRequest): Promise<Class> => {
    return api.post('/classes', classData);
  },

  // Update an existing class
  updateClass: async (id: string, classData: UpdateClassRequest): Promise<Class> => {
    return api.put(`/classes/${id}`, classData);
  },

  // Delete a class
  deleteClass: async (id: string): Promise<void> => {
    return api.delete(`/classes/${id}`);
  },

  // Add students to a class
  addStudentsToClass: async (data: AddStudentsToClassRequest): Promise<Class> => {
    return api.post(`/classes/${data.classId}/students`, {
      studentIds: data.studentIds
    });
  },

  // Remove a student from a class
  removeStudentFromClass: async (classId: string, studentId: string): Promise<Class> => {
    return api.delete(`/classes/${classId}/students/${studentId}`);
  },

  // Get classes by teacher
  getClassesByTeacher: async (teacherId: string): Promise<Class[]> => {
    return api.get(`/classes/teacher/${teacherId}`);
  },

  // Get classes by school
  getClassesBySchool: async (schoolId: string): Promise<Class[]> => {
    return api.get(`/classes/school/${schoolId}`);
  },

  // Start class recording
  startClassRecording: async (classId: string, data: { title?: string; description?: string }) => {
    return api.post(`/classes/${classId}/recordings/start`, data);
  },

  // Stop class recording
  stopClassRecording: async (classId: string, recordingId: string, data: { transcript?: string; duration?: number }) => {
    return api.post(`/classes/${classId}/recordings/${recordingId}/stop`, data);
  },

  // Get class with analyses
  getClassWithAnalyses: async (classId: string) => {
    return api.get(`/classes/${classId}/analyses`);
  },

  // Get user's analyses (secure)
  getUserAnalyses: async (page = 1, limit = 10) => {
    return api.get(`/analysis/user?page=${page}&limit=${limit}`);
  },
};
