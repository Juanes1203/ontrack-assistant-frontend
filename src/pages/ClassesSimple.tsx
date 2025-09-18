import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Play,
  Square,
  FileText,
  Brain,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { classesService } from '@/services/classesService';
import { liveTranscriptionService, LiveTranscriptionResult } from '@/services/liveTranscriptionService';
import ClassAnalysisModal from '@/components/Classes/ClassAnalysisModal';
import ClassRecordingModal from '@/components/Classes/ClassRecordingModal';

interface ClassWithDetails {
  id: string;
  name: string;
  subject: string;
  location: string;
  schedule: string;
  maxStudents: number;
  status?: string;
  description?: string;
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

const ClassesSimple = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    schedule: ''
  });
  const [recordingClass, setRecordingClass] = useState<ClassWithDetails | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [transcriptConfidence, setTranscriptConfidence] = useState(0);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [selectedClassForAnalysis, setSelectedClassForAnalysis] = useState<ClassWithDetails | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisData, setAnalysisData] = useState<string | null>(null);
  const [showAnalysisConfirmation, setShowAnalysisConfirmation] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [selectedClassForRecording, setSelectedClassForRecording] = useState<ClassWithDetails | null>(null);

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

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación del lado del cliente
    if (newClass.name.length < 2) {
      setError('El nombre de la clase debe tener al menos 2 caracteres');
      return;
    }
    if (newClass.subject.length < 2) {
      setError('La materia debe tener al menos 2 caracteres');
      return;
    }
    if (!newClass.schedule) {
      setError('Debe seleccionar un horario');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null); // Limpiar errores anteriores
      console.log('Creating class with data:', newClass);
      const response = await classesService.createClass(newClass);
      console.log('Class created successfully:', response);
      setNewClass({
        name: '',
        subject: '',
        schedule: ''
      });
      setShowCreateForm(false);
      await loadClasses();
    } catch (err: any) {
      console.error('Error creating class:', err);
      setError('Error al crear la clase: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async (classItem: ClassWithDetails) => {
    setSelectedClassForRecording(classItem);
    setShowRecordingModal(true);
  };

  const handleStartRecording = async (title: string, description: string) => {
    if (!selectedClassForRecording) return;
    
    try {
      setRecordingClass(selectedClassForRecording);
      setIsRecording(true);
      setRecordingTime(0);
      setLiveTranscript('');
      setTranscriptConfidence(0);
      
      // Iniciar grabación en el backend
      const response = await classesService.startClassRecording(selectedClassForRecording.id, {
        title,
        description
      });
      
      setRecordingId(response.data.id);
      
      // Iniciar transcripción en vivo
      try {
        await liveTranscriptionService.startRecording(
          (result: LiveTranscriptionResult) => {
            setLiveTranscript(result.transcript);
            setTranscriptConfidence(result.confidence);
          },
          (error: string) => {
            setError('Error en transcripción: ' + error);
          }
        );
      } catch (error: any) {
        setError('Error al iniciar transcripción: ' + error.message);
        setIsRecording(false);
        return;
      }
      
      // Contador de tiempo
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Guardar referencia del interval para poder limpiarlo
      (window as any).recordingInterval = interval;
      
    } catch (err: any) {
      setError('Error al iniciar la grabación: ' + err.message);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      
      // Detener transcripción en vivo
      liveTranscriptionService.stopRecording();
      
      // Limpiar contador de tiempo
      if ((window as any).recordingInterval) {
        clearInterval((window as any).recordingInterval);
        (window as any).recordingInterval = null;
      }
      
      // Obtener transcripción final
      const finalTranscript = liveTranscriptionService.getFullTranscript();
      
      if (recordingId && recordingClass) {
        // Enviar transcripción al backend para análisis
        await classesService.stopClassRecording(recordingClass.id, recordingId, {
          transcript: finalTranscript,
          duration: recordingTime
        });
        
        console.log('Transcripción enviada al backend para análisis con IA:', finalTranscript);
        console.log('El backend procesará la transcripción y generará un análisis detallado usando Straico API');
        
        // Mostrar confirmación de análisis
        setShowAnalysisConfirmation(true);
        setTimeout(() => {
          setShowAnalysisConfirmation(false);
        }, 5000); // Ocultar después de 5 segundos
      }
      
      // Limpiar estado
      setRecordingClass(null);
      setRecordingTime(0);
      setLiveTranscript('');
      setTranscriptConfidence(0);
      setRecordingId(null);
      liveTranscriptionService.reset();
      
      // Recargar clases para mostrar la nueva grabación
      await loadClasses();
      
    } catch (err: any) {
      setError('Error al detener la grabación: ' + err.message);
    }
  };

  const handleStopRecording = async (transcript: string, duration: number) => {
    try {
      setIsRecording(false);
      
      // Detener transcripción en vivo
      liveTranscriptionService.stopRecording();
      
      // Limpiar contador de tiempo
      if ((window as any).recordingInterval) {
        clearInterval((window as any).recordingInterval);
        (window as any).recordingInterval = null;
      }
      
      if (recordingId && recordingClass) {
        // Enviar transcripción al backend para análisis
        await classesService.stopClassRecording(recordingClass.id, recordingId, {
          transcript,
          duration
        });
        
        console.log('Transcripción enviada al backend para análisis con IA:', transcript);
        console.log('El backend procesará la transcripción y generará un análisis detallado usando Straico API');
        
        // Mostrar confirmación de análisis
        setShowAnalysisConfirmation(true);
        setTimeout(() => {
          setShowAnalysisConfirmation(false);
        }, 5000); // Ocultar después de 5 segundos
      }
      
      // Limpiar estado
      setRecordingClass(null);
      setRecordingTime(0);
      setLiveTranscript('');
      setTranscriptConfidence(0);
      setRecordingId(null);
      liveTranscriptionService.reset();
      
      // Cerrar modal
      setShowRecordingModal(false);
      setSelectedClassForRecording(null);
      
      // Recargar clases para mostrar la nueva grabación
      await loadClasses();
      
    } catch (err: any) {
      setError('Error al detener la grabación: ' + err.message);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShowAnalysis = (classItem: ClassWithDetails) => {
    // Navegar a la página de análisis completa
    navigate(`/class/${classItem.id}/analysis-page`);
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Clase
            </Button>
            <Button onClick={loadClasses} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

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

        {/* Create Class Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Crear Nueva Clase</CardTitle>
              <CardDescription>
                Completa la información para crear una nueva clase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nombre de la Clase</label>
                    <Input
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                      placeholder="Ej: Matemáticas Avanzadas"
                      minLength={2}
                      required
                    />
                    {newClass.name.length > 0 && newClass.name.length < 2 && (
                      <p className="text-xs text-red-500 mt-1">Mínimo 2 caracteres</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Materia</label>
                    <Input
                      value={newClass.subject}
                      onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                      placeholder="Ej: Matemáticas"
                      minLength={2}
                      required
                    />
                    {newClass.subject.length > 0 && newClass.subject.length < 2 && (
                      <p className="text-xs text-red-500 mt-1">Mínimo 2 caracteres</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Hora de Inicio</label>
                    <select
                      value={newClass.schedule}
                      onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar hora de inicio</option>
                      <option value="07:00">07:00</option>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                    </select>
                    {!newClass.schedule && (
                      <p className="text-xs text-red-500 mt-1">Debe seleccionar una hora de inicio</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creando...' : 'Crear Clase'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Analysis Confirmation */}
        {showAnalysisConfirmation && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold text-green-800">Análisis en Progreso</h3>
                  <p className="text-sm text-green-600">
                    La transcripción se está analizando con IA. 
                    <br />
                    <strong>El análisis aparecerá en el botón "Análisis" de la clase en unos minutos.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recording Status */}
        {isRecording && recordingClass && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                      <h3 className="font-semibold text-red-800">Grabando: {recordingClass.name}</h3>
                      <p className="text-sm text-red-600">Tiempo: {formatTime(recordingTime)}</p>
                    </div>
                  </div>
                  <Button onClick={stopRecording} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Detener Grabación
                  </Button>
                </div>
                
                {/* Live Transcript */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Transcripción en Vivo</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600">
                        Confianza: {Math.round(transcriptConfidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {liveTranscript || 'Iniciando transcripción...'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <Badge variant="outline">
                      {classItem.status || 'SCHEDULED'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {classItem.schedule}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {classItem._count.recordings} grabaciones
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {!isRecording ? (
                      <Button
                        size="sm"
                        onClick={() => startRecording(classItem)}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        disabled={isLoading}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Grabar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={stopRecording}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Detener
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowAnalysis(classItem)}
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      Análisis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recording Modal */}
        <ClassRecordingModal
          isOpen={showRecordingModal}
          onClose={() => {
            setShowRecordingModal(false);
            setSelectedClassForRecording(null);
          }}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          className={selectedClassForRecording?.name || ''}
          isRecording={isRecording}
          recordingTime={recordingTime}
          liveTranscript={liveTranscript}
          transcriptConfidence={transcriptConfidence}
        />

        {/* Analysis Modal */}
        <ClassAnalysisModal
          isOpen={showAnalysisModal}
          onClose={() => {
            setShowAnalysisModal(false);
            setSelectedClassForAnalysis(null);
            setAnalysisData(null);
          }}
          analysisData={analysisData}
          className={selectedClassForAnalysis?.name}
          onRefresh={() => {
            if (selectedClassForAnalysis) {
              handleShowAnalysis(selectedClassForAnalysis);
            }
          }}
        />
      </div>
    </MainLayout>
  );
};

export default ClassesSimple;
