import { api } from './apiClient';
import { 
  Student, 
  CreateStudentRequest, 
  UpdateStudentRequest,
  PaginatedResponse 
} from '@/types/api';

export const studentsService = {
  // Get all students
  getStudents: async (page = 1, limit = 10): Promise<PaginatedResponse<Student>> => {
    return api.get(`/students?page=${page}&limit=${limit}`);
  },

  // Get a specific student by ID
  getStudentById: async (id: string): Promise<Student> => {
    return api.get(`/students/${id}`);
  },

  // Create a new student
  createStudent: async (studentData: CreateStudentRequest): Promise<Student> => {
    return api.post('/students', studentData);
  },

  // Update an existing student
  updateStudent: async (id: string, studentData: UpdateStudentRequest): Promise<Student> => {
    return api.put(`/students/${id}`, studentData);
  },

  // Delete a student
  deleteStudent: async (id: string): Promise<void> => {
    return api.delete(`/students/${id}`);
  },

  // Get students by school
  getStudentsBySchool: async (schoolId: string): Promise<Student[]> => {
    return api.get(`/students/school/${schoolId}`);
  },

  // Search students
  searchStudents: async (query: string): Promise<Student[]> => {
    return api.get(`/students/search?q=${encodeURIComponent(query)}`);
  },

  // Get students not in a specific class
  getAvailableStudentsForClass: async (classId: string): Promise<Student[]> => {
    return api.get(`/students/available/${classId}`);
  },
};
