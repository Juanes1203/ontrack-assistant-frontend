import { api } from './apiClient';

export interface Recording {
  id: string;
  classId: string;
  teacherId: string;
  title?: string;
  description?: string;
  transcript?: string;
  duration?: number;
  recordingUrl?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  analyses?: Array<{
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    analysisData: any;
    createdAt: string;
  }>;
}

export interface CreateRecordingRequest {
  classId: string;
  title?: string;
  description?: string;
  transcript?: string;
  duration?: number;
}

export interface StartRecordingRequest {
  classId: string;
  title?: string;
  description?: string;
}

export interface StopRecordingRequest {
  recordingId: string;
  transcript?: string;
  duration?: number;
}

export interface UploadTranscribeRequest {
  classId: string;
  title?: string;
  description?: string;
}

export const recordingsService = {
  // Get all recordings for a class
  async getClassRecordings(classId: string, page = 1, limit = 10) {
    return api.get(`/recordings/class/${classId}?page=${page}&limit=${limit}`);
  },

  // Get a specific recording
  async getRecording(recordingId: string) {
    return api.get(`/recordings/${recordingId}`);
  },

  // Create a new recording
  async createRecording(data: CreateRecordingRequest) {
    return api.post('/recordings', data);
  },

  // Start a class recording
  async startClassRecording(classId: string, data: StartRecordingRequest) {
    return api.post(`/classes/${classId}/recordings/start`, data);
  },

  // Stop a class recording
  async stopClassRecording(classId: string, recordingId: string, data: StopRecordingRequest) {
    return api.post(`/classes/${classId}/recordings/${recordingId}/stop`, data);
  },

  // Upload and transcribe audio file
  async uploadAndTranscribe(formData: FormData) {
    return api.post('/recordings/upload-transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Process recording with analysis (no file upload)
  async processRecordingWithAnalysis(data: { classId: string; transcript: string; duration?: number }) {
    return api.post('/recordings/process', data);
  },

  // Update recording
  async updateRecording(recordingId: string, data: Partial<CreateRecordingRequest>) {
    return api.put(`/recordings/${recordingId}`, data);
  },

  // Delete recording
  async deleteRecording(recordingId: string) {
    return api.delete(`/recordings/${recordingId}`);
  },

  // Download recording file
  async downloadRecording(recordingId: string) {
    return api.get(`/recordings/${recordingId}/download`, {
      responseType: 'blob',
    });
  },

  // Get class with analyses
  async getClassWithAnalyses(classId: string) {
    return api.get(`/classes/${classId}/analyses`);
  }
};
