// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'admin';
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Student Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

// Class Types
export interface Class {
  id: string;
  name: string;
  subject: string;
  location: string;
  schedule: string;
  teacherId: string;
  schoolId: string;
  maxStudents: number;
  students: string[]; // Array of student IDs
  transcript?: string;
  hasAnalysis?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassWithDetails extends Class {
  teacher: User;
  studentsList: Student[];
  recordings: Recording[];
  analyses: AIAnalysis[];
}

// Recording Types
export interface Recording {
  id: string;
  classId: string;
  teacherId: string;
  transcript: string;
  duration: number; // in seconds
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// AI Analysis Types
export interface AIAnalysis {
  id: string;
  recordingId: string;
  analysisData: ClassAnalysis;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// Import existing ClassAnalysis type
import { ClassAnalysis } from './classAnalysis';

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'admin';
  schoolId?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Request Types
export interface CreateClassRequest {
  name: string;
  subject: string;
  location: string;
  schedule: string;
  maxStudents: number;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  id: string;
}

export interface AddStudentsToClassRequest {
  classId: string;
  studentIds: string[];
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  id: string;
}

// Analysis Request Types
export interface AnalyzeRecordingRequest {
  recordingId: string;
  transcript: string;
}

export interface AnalyzeTranscriptRequest {
  transcript: string;
  classId: string;
}
