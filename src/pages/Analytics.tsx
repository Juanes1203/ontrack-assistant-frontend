import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Target,
  Brain,
  FileText,
  Activity,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { analysisService } from '@/services/analysisService';
import { classesService } from '@/services/classesService';

interface AnalyticsData {
  totalClasses: number;
  totalStudents: number;
  totalRecordings: number;
  totalAnalyses: number;
  averageScore: number;
  participationRate: number;
  recentAnalyses: any[];
  classPerformance: any[];
  monthlyStats: any[];
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with real API calls
      const mockData: AnalyticsData = {
        totalClasses: 12,
        totalStudents: 245,
        totalRecordings: 48,
        totalAnalyses: 42,
        averageScore: 8.3,
        participationRate: 78,
        recentAnalyses: [
          {
            id: 'analysis-1',
            className: 'Matemáticas Básicas',
            date: '2024-01-15',
            score: 8.5,
            status: 'COMPLETED'
          },
          {
            id: 'analysis-2',
            className: 'Ciencias Naturales',
            date: '2024-01-14',
            score: 7.8,
            status: 'COMPLETED'
          },
          {
            id: 'analysis-3',
            className: 'Lengua Española',
            date: '2024-01-13',
            score: 9.1,
            status: 'COMPLETED'
          }
        ],
        classPerformance: [
          { name: 'Matemáticas', score: 8.5, recordings: 12 },
          { name: 'Ciencias', score: 7.8, recordings: 8 },
          { name: 'Lengua', score: 9.1, recordings: 15 },
          { name: 'Historia', score: 8.2, recordings: 6 }
        ],
        monthlyStats: [
          { month: 'Ene', classes: 8, analyses: 12 },
          { month: 'Feb', classes: 12, analyses: 18 },
          { month: 'Mar', classes: 15, analyses: 22 },
          { month: 'Abr', classes: 10, analyses: 16 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No se pudieron cargar los datos de analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado del rendimiento y métricas de las clases
            </p>
          </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === '7d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('7d')}
            size="sm"
          >
            7 días
          </Button>
          <Button
            variant={selectedPeriod === '30d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('30d')}
            size="sm"
          >
            30 días
            </Button>
          <Button
            variant={selectedPeriod === '90d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('90d')}
            size="sm"
          >
            90 días
            </Button>
          </div>
        </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clases</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +12 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grabaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalRecordings}</div>
            <p className="text-xs text-muted-foreground">
              +8 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análisis Completados</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              +6 desde el mes pasado
            </p>
          </CardContent>
        </Card>
            </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Rendimiento General
            </CardTitle>
            <CardDescription>
              Métricas clave de rendimiento de las clases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Puntuación Promedio</span>
              </div>
              <Badge variant="secondary" className="text-lg font-bold">
                {analyticsData.averageScore}/10
                      </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Tasa de Participación</span>
                    </div>
              <Badge variant="secondary" className="text-lg font-bold">
                {analyticsData.participationRate}%
              </Badge>
          </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${analyticsData.averageScore * 10}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Rendimiento por Materia
            </CardTitle>
            <CardDescription>
              Comparación de rendimiento entre diferentes materias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.classPerformance.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{subject.score}/10</Badge>
                    <span className="text-xs text-gray-500">{subject.recordings} grabaciones</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
                  </div>
                  
      {/* Recent Analyses and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Análisis Recientes
            </CardTitle>
            <CardDescription>
              Últimos análisis completados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{analysis.className}</p>
                    <p className="text-sm text-gray-500">{analysis.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={analysis.score >= 8 ? 'default' : analysis.score >= 6 ? 'secondary' : 'destructive'}
                    >
                      {analysis.score}/10
                    </Badge>
                    <Badge variant="outline">{analysis.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Tendencias Mensuales
            </CardTitle>
            <CardDescription>
              Evolución de clases y análisis por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyStats.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">{month.classes} clases</span>
                      </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">{month.analyses} análisis</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Ver Reporte Detallado
        </Button>
        <Button variant="outline" className="flex items-center">
          <Award className="w-4 h-4 mr-2" />
          Exportar Datos
        </Button>
      </div>
    </div>
  );
};

export default Analytics;