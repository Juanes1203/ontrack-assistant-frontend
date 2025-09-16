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

// Mock data for development
const mockDashboardStats: DashboardStats = {
  overview: {
    totalClasses: 12,
    totalStudents: 45,
    totalRecordings: 28,
    totalAnalyses: 24
  },
  performance: {
    overallScore: 87.5,
    participationRate: 92.3
  },
  recentAnalyses: [
    {
      id: '1',
      className: 'Matemáticas 5°',
      subject: 'Matemáticas',
      score: 85.2,
      status: 'Completado',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      className: 'Ciencias 4°',
      subject: 'Ciencias',
      score: 91.8,
      status: 'Completado',
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      className: 'Español 3°',
      subject: 'Español',
      score: 78.9,
      status: 'En Proceso',
      createdAt: '2024-01-13T09:15:00Z'
    }
  ],
  subjectPerformance: [
    {
      subject: 'Matemáticas',
      averageScore: '88.5',
      recordings: 8
    },
    {
      subject: 'Ciencias',
      averageScore: '92.1',
      recordings: 6
    },
    {
      subject: 'Español',
      averageScore: '85.3',
      recordings: 7
    },
    {
      subject: 'Historia',
      averageScore: '79.8',
      recordings: 4
    }
  ],
  monthlyTrends: [
    { month: 'Enero', classes: 8, analyses: 12 },
    { month: 'Febrero', classes: 10, analyses: 15 },
    { month: 'Marzo', classes: 12, analyses: 18 },
    { month: 'Abril', classes: 9, analyses: 14 }
  ]
};

export const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Try to fetch from API first
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      // Return mock data if API is not available
      return mockDashboardStats;
    }
  }
};
