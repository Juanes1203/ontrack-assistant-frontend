import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layout';
import { Search, Plus, BookOpen, Users, Clock, MapPin, Eye, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/apiClient';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener clases reales
        const classesResponse = await apiClient.get('/classes');
        const classesData = classesResponse.data.data || classesResponse.data || [];
        setClasses(classesData);

        // Obtener estadísticas reales del dashboard
        const statsResponse = await apiClient.get('/dashboard/stats');
        const statsData = statsResponse.data.data || statsResponse.data;
        console.log('Dashboard stats received:', statsData);
        setDashboardStats(statsData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Datos del resumen basados en stats reales
  const summaryData = dashboardStats?.overview ? [
    {
      title: 'Total de Clases',
      value: dashboardStats.overview.totalClasses?.toString() || '0',
      icon: BookOpen,
      iconColor: 'text-green-600',
      bgColor: 'bg-white',
      borderColor: 'border-green-200'
    },
    {
      title: 'Estudiantes Activos',
      value: dashboardStats.overview.totalStudents?.toString() || '0',
      icon: Users,
      iconColor: 'text-gray-600',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200'
    },
    {
      title: 'Grabaciones',
      value: dashboardStats.overview.totalRecordings?.toString() || '0',
      subtitle: 'Total',
      icon: Clock,
      iconColor: 'text-green-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      title: 'Análisis Completados',
      value: dashboardStats.overview.totalAnalyses?.toString() || '0',
      icon: BarChart3,
      iconColor: 'text-green-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ] : [];

  const handleViewDetails = (classId: string) => {
    console.log('Navigating to class details:', classId);
    navigate(`/class/${classId}`);
  };

  const handleNewClass = () => {
    navigate('/classes');
  };

  // Filtrar clases basado en el término de búsqueda
  const filteredClasses = classes.filter(cls => 
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 max-w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Mis Clases
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona y monitorea tu horario de enseñanza
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar clases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white border-gray-300 focus:border-green-400 focus:ring-green-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Analytics Button */}
            <Button 
              variant="outline"
              onClick={() => navigate('/classes')}
              className="border-green-200 text-green-700 hover:bg-green-50 w-full sm:w-auto"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Clases
            </Button>
            
            {/* New Class Button */}
            <Button 
              onClick={handleNewClass}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Clase
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Cargando datos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {summaryData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg p-4 lg:p-6 border ${item.borderColor} shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl lg:text-3xl font-bold text-gray-800">{item.value}</span>
                      {item.subtitle && (
                        <span className="text-sm text-gray-500">{item.subtitle}</span>
                      )}
                    </div>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-lg bg-gray-50`}>
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${item.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Class Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-6">
            {searchTerm ? `Resultados de búsqueda para "${searchTerm}"` : 'Clases Recientes'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                {/* Class Image */}
                <div className="relative h-40 lg:h-48 bg-gradient-to-br from-green-400 to-green-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white opacity-50" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`absolute top-3 right-3 ${
                      cls.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                      cls.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    {cls.status === 'COMPLETED' ? 'Completada' :
                     cls.status === 'IN_PROGRESS' ? 'En progreso' :
                     cls.status === 'PENDING' ? 'En proceso' :
                     cls.status === 'FAILED' ? 'Fallida' :
                     cls.status === 'SCHEDULED' ? 'Programada' : cls.status}
                  </Badge>
                </div>

                {/* Class Content */}
                <div className="p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
                    {cls.name}
                  </h3>
                  
                  <Badge variant="outline" className="mb-4 text-gray-600 border-gray-300">
                    {cls.subject}
                  </Badge>

                  {/* Class Details */}
                  <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {cls._count?.classStudents || cls.classStudents?.length || 0} estudiantes
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{cls.schedule || 'Sin horario'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{cls.location || 'Sin ubicación'}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Button
                    onClick={() => handleViewDetails(cls.id)}
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clases</h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `No hay clases que coincidan con "${searchTerm}"`
                      : 'No hay clases disponibles en este momento'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
