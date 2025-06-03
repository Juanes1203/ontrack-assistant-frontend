
import React, { useState } from 'react';
import { Plus, BookOpen, Clock, User, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useClass } from '@/contexts/ClassContext';
import CreateClassModal from '@/components/CreateClassModal';

const Index = () => {
  const navigate = useNavigate();
  const { classes, addClass } = useClass();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateClass = (newClass: {
    name: string;
    teacher: string;
    day: string;
    time: string;
    description: string;
    subject: string;
    duration: number;
  }) => {
    addClass(newClass);
    setShowCreateModal(false);
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClassClick = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 Gestión de Clases
            </h1>
            <p className="text-gray-600 text-lg">
              Organiza, graba y analiza tus clases con inteligencia artificial
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Clase
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar clases por nombre, profesor o materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 rounded-lg"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total de Clases</p>
                  <p className="text-3xl font-bold">{classes.length}</p>
                </div>
                <BookOpen className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Clases esta Semana</p>
                  <p className="text-3xl font-bold">{classes.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Horas Totales</p>
                  <p className="text-3xl font-bold">{classes.reduce((sum, cls) => sum + cls.duration, 0)}min</p>
                </div>
                <Clock className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <Card 
              key={classItem.id} 
              className="hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer border-2 hover:border-blue-300 bg-white"
              onClick={() => handleClassClick(classItem.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                    {classItem.name}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                    {classItem.subject}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 line-clamp-2">
                  {classItem.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">{classItem.teacher}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-green-500" />
                    <span>{classItem.day}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-500" />
                      <span>{classItem.time}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {classItem.duration} min
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClassClick(classItem.id);
                    }}
                  >
                    Abrir Clase
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4 float-animation" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No se encontraron clases' : 'No hay clases creadas'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza creando tu primera clase'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Primera Clase
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateClassModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateClass={handleCreateClass}
      />
    </div>
  );
};

export default Index;
