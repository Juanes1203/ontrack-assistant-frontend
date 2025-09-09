import { api } from './apiClient';
import { 
  AIAnalysis, 
  AnalyzeRecordingRequest, 
  AnalyzeTranscriptRequest,
  Recording 
} from '@/types/api';

export const analysisService = {
  // Analyze a recording
  analyzeRecording: async (data: AnalyzeRecordingRequest): Promise<AIAnalysis> => {
    return api.post('/analysis/recording', data);
  },

  // Analyze a transcript directly
  analyzeTranscript: async (data: AnalyzeTranscriptRequest): Promise<AIAnalysis> => {
    return api.post('/analysis/transcript', data);
  },

  // Get analysis by ID
  getAnalysisById: async (id: string): Promise<AIAnalysis> => {
    return api.get(`/analysis/${id}`);
  },

  // Get analyses for a class
  getAnalysesByClass: async (classId: string): Promise<AIAnalysis[]> => {
    return api.get(`/analysis/class/${classId}`);
  },

  // Get analyses for a recording
  getAnalysesByRecording: async (recordingId: string): Promise<AIAnalysis[]> => {
    return api.get(`/analysis/recording/${recordingId}`);
  },

  // Delete an analysis
  deleteAnalysis: async (id: string): Promise<void> => {
    return api.delete(`/analysis/${id}`);
  },

  // Get analysis status
  getAnalysisStatus: async (id: string): Promise<{ status: string; progress?: number }> => {
    return api.get(`/analysis/${id}/status`);
  },
};