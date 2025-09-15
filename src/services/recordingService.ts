import { api } from './apiClient';

export interface CreateRecordingRequest {
  classId: string;
  transcript: string;
  duration: number;
  metadata?: any;
}

export interface Recording {
  id: string;
  classId: string;
  teacherId: string;
  transcript: string;
  duration: number;
  recordingUrl: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    name: string;
    subject: string;
  };
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  aiAnalyses?: Array<{
    id: string;
    status: string;
    createdAt: string;
  }>;
}

export interface ProcessRecordingResponse {
  recording: Recording;
  analysis: {
    id: string;
    status: string;
  };
}

export const recordingService = {
  // Process recording with AI analysis
  processRecording: async (data: CreateRecordingRequest): Promise<ProcessRecordingResponse> => {
    const response = await api.post('/recordings/process', data);
    return response.data;
  },

  // Get recordings for a class
  getClassRecordings: async (classId: string): Promise<{ recordings: Recording[] }> => {
    const response = await api.get(`/recordings/class/${classId}`);
    return response.data;
  },

  // Get specific recording
  getRecording: async (recordingId: string): Promise<{ recording: Recording }> => {
    const response = await api.get(`/recordings/${recordingId}`);
    return response.data;
  },

  // Update recording
  updateRecording: async (recordingId: string, data: Partial<CreateRecordingRequest>): Promise<{ recording: Recording }> => {
    const response = await api.put(`/recordings/${recordingId}`, data);
    return response.data;
  },

  // Delete recording
  deleteRecording: async (recordingId: string): Promise<void> => {
    await api.delete(`/recordings/${recordingId}`);
  }
};
