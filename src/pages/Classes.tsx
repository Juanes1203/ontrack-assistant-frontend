import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Users, 
  Clock, 
  MapPin,
  Calendar,
  MoreHorizontal,
  Play,
  FileText,
  Brain,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { classesService } from '@/services/classesService';
import { ClassRecording } from '@/components/Classes/ClassRecording';
import { CreateTeacherForm } from '@/components/Admin/CreateTeacherForm';
import { Class } from '@/types/api';

interface ClassWithDetails extends Class {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  school: {
    id: string;
    name: string;
  };
  classStudents: Array<{
    id: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
  }>;
  _count: {
    classStudents: number;
    recordings: number;
  };
}

const Classes = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassWithDetails | null>(null);
  const [showCreateTeacher, setShowCreateTeacher] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await classesService.getClasses();
      setClasses(response.data as ClassWithDetails[]);
    } catch (err: any) {
      setError('Error al cargar las clases');
      console.error('Error loading classes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecordingSaved = () => {
    loadClasses(); // Refresh classes to update recording count
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando clases...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clases</h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus clases, horarios e información de estudiantes
            </p>
          </div>
          <div className="flex gap-2">
            {user?.role === 'admin' && (
              <Button 
                onClick={() => setShowCreateTeacher(!showCreateTeacher)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Profesor
              </Button>
            )}
            <Button onClick={loadClasses} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Create Teacher Form (Admin only) */}
        {showCreateTeacher && user?.role === 'admin' && (
          <CreateTeacherForm onSuccess={() => setShowCreateTeacher(false)} />
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clases por nombre, materia o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No se encontraron clases' : 'No hay clases disponibles'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Las clases aparecerán aquí cuando se creen'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {classItem.subject}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClass(selectedClass?.id === classItem.id ? null : classItem)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {classItem.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {classItem.schedule}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {classItem._count.classStudents} / {classItem.maxStudents} estudiantes
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {classItem._count.recordings} grabaciones
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedClass(selectedClass?.id === classItem.id ? null : classItem)}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Grabar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `#/class/${classItem.id}`}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recording Modal */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ClassRecording
                classId={selectedClass.id}
                className={selectedClass.name}
                onRecordingSaved={handleRecordingSaved}
              />
              <div className="p-4 border-t">
                <Button
                  onClick={() => setSelectedClass(null)}
                  variant="outline"
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Classes;