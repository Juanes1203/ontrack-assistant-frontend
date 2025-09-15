import { api } from './apiClient';

export interface DashboardStats {
  overview: {
    totalClasses: number;
    totalStudents: number;
    totalRecordings: number;
    totalAnalyses: number;
  };
  performance: {
    overallScore: number;
    participationRate: number;
  };
  recentAnalyses: Array<{
    id: string;
    className: string;
    subject: string;
    score: number;
    status: string;
    createdAt: string;
  }>;
  subjectPerformance: Array<{
    subject: string;
    averageScore: string;
    recordings: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    classes: number;
    analyses: number;
  }>;
}

export const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};
