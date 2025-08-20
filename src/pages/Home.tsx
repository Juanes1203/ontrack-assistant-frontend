import React from 'react';
import { MainLayout } from '@/components/Layout';
import { Search, Plus, BookOpen, Users, Clock, MapPin, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const summaryData = [
    {
      title: 'Total de Clases',
      value: '4',
      icon: BookOpen,
      iconColor: 'text-green-600',
      bgColor: 'bg-white',
      borderColor: 'border-green-200'
    },
    {
      title: 'Estudiantes Activos',
      value: '95',
      icon: Users,
      iconColor: 'text-gray-600',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200'
    },
    {
      title: 'Esta Semana',
      value: '12',
      subtitle: 'Sesiones',
      icon: Clock,
      iconColor: 'text-green-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      title: 'Tasa de Finalización',
      value: '94%',
      icon: BookOpen,
      iconColor: 'text-green-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  const classData = [
    {
      id: '1',
      title: 'Matemáticas Avanzadas',
      category: 'Matemáticas',
      students: 28,
      schedule: 'Lun, Mié, Vie - 09:00-10:30',
      room: 'Sala 204',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop',
      status: 'active'
    },
    {
      id: '2',
      title: 'Laboratorio de Física',
      category: 'Física',
      students: 20,
      schedule: 'Mar, Jue - 14:00-15:30',
      room: 'Laboratorio 1',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
      status: 'active'
    },
    {
      id: '3',
      title: 'Química Básica',
      category: 'Química',
      students: 25,
      schedule: 'Lun, Mié - 10:00-11:30',
      room: 'Sala 301',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop',
      status: 'active'
    }
  ];

  const handleViewDetails = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  const handleNewClass = () => {
    navigate('/classes');
  };

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
                className="pl-10 w-full bg-white border-gray-300 focus:border-green-400 focus:ring-green-400"
              />
            </div>
            
            {/* Analytics Button */}
            <Button 
              variant="outline"
              onClick={() => navigate('/analytics')}
              className="border-green-200 text-green-700 hover:bg-green-50 w-full sm:w-auto"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Análisis
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

        {/* Class Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Clases Recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {classData.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Class Image */}
                <div className="relative h-40 lg:h-48 bg-gray-200">
                  <img
                    src={cls.image}
                    alt={cls.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 bg-green-100 text-green-800 border-green-200"
                  >
                    {cls.status}
                  </Badge>
                </div>

                {/* Class Content */}
                <div className="p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
                    {cls.title}
                  </h3>
                  
                  <Badge variant="outline" className="mb-4 text-gray-600 border-gray-300">
                    {cls.category}
                  </Badge>

                  {/* Class Details */}
                  <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{cls.students} estudiantes</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{cls.schedule}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{cls.room}</span>
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
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
