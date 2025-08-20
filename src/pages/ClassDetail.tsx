import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { flushSync } from 'react-dom';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  BookOpen,
  ClipboardList,
  Clock,
  Mic,
  MicOff,
  Plus,
  Eye,
  UserPlus,
  GraduationCap,
  User,
  MapPin,
  Bell,
  Home,
  MessageSquare,
  FileText as FileTextIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useClass } from '@/contexts/ClassContext';
import { MainLayout } from '@/components/Layout';

import { useRecording } from '@/components/class-detail/useRecording';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getClassById } = useClass();
  const [selectedLanguages, setSelectedLanguages] = useState(['en-US', 'es-ES']);
  const [recordingMode, setRecordingMode] = useState<'group' | 'individual'>('group');
  const [isRecordingLocal, setIsRecordingLocal] = useState(false); // Simple boolean state
  const [forceRender, setForceRender] = useState(0); // Force component re-render
  const [recordingTime, setRecordingTime] = useState(0); // Recording time in seconds
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  
  const classData = getClassById(classId || '');
  
  const {
    isRecording,
    participants,
    startRecording,
    stopRecording,
    addParticipant,
    removeParticipant,
    transcript,
    setTranscript
  } = useRecording(selectedLanguages);

  // Initialize default participants when component mounts
  useEffect(() => {
    if (participants.length === 0) {
      addParticipant('Juan Carlos Suarez', 'teacher');
      addParticipant('Cristina Paez', 'student');
      addParticipant('Ana Maria Cruz', 'student');
      addParticipant('Laura Silva', 'student');
    }
  }, [participants.length, addParticipant]);

  // Start/stop recording timer
  useEffect(() => {
    if (isRecordingLocal) {
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else {
      // Stop timer
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setRecordingTime(0); // Reset to 0 when stopping
    }

    // Cleanup
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [isRecordingLocal]);

  // Format recording time as MM:SS
  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Sample participants data for display
  const sampleParticipants = [
    { id: '1', name: 'Juan Carlos Suarez', role: 'Teacher', isRecording: participants.find(p => p.name === 'Juan Carlos Suarez')?.isRecording || false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { id: '2', name: 'Cristina Paez', role: 'Student', isRecording: participants.find(p => p.name === 'Cristina Paez')?.isRecording || false, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
    { id: '3', name: 'Ana Maria Cruz', role: 'Student', isRecording: participants.find(p => p.name === 'Ana Maria Cruz')?.isRecording || false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    { id: '4', name: 'Laura Silva', role: 'Student', isRecording: participants.find(p => p.name === 'Laura Silva')?.isRecording || false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' }
  ];

  if (!classData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Clase no encontrada</h1>
            <p className="text-gray-600 mb-6">La clase que buscas no existe o ha sido eliminada.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleStartRecording = () => {
    console.log('Starting recording for all participants...');
    console.log('Before setIsRecordingLocal(true), isRecordingLocal:', isRecordingLocal);
    
    // Update local state immediately
    setIsRecordingLocal(true);
    setForceRender(prev => prev + 1); // Force re-render
    
    console.log('After setIsRecordingLocal(true), isRecordingLocal:', true);
    
    // Start recording for all participants
    participants.forEach(participant => {
      startRecording(participant.id);
    });
    
    toast({
      title: "Grabación iniciada",
      description: "La grabación de voz ha comenzado para todos los participantes",
    });
  };

  const handleStopRecording = () => {
    console.log('Stopping recording for all participants...');
    console.log('Before setIsRecordingLocal(false), isRecordingLocal:', isRecordingLocal);
    
    // Update local state immediately
    setIsRecordingLocal(false);
    setForceRender(prev => prev + 1); // Force re-render
    
    console.log('After setIsRecordingLocal(false), isRecordingLocal:', false);
    
    // Stop recording for all participants
    participants.forEach(participant => {
      stopRecording(participant.id);
    });
    
    toast({
      title: "Grabación detenida",
      description: "La grabación de voz se ha detenido",
    });
  };

  const handleIndividualRecording = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      if (participant.isRecording) {
        stopRecording(participantId);
        toast({
          title: "Grabación detenida",
          description: `Se detuvo la grabación de ${participant.name}`,
        });
      } else {
        startRecording(participantId);
        toast({
          title: "Grabación iniciada",
          description: `Se inició la grabación de ${participant.name}`,
        });
      }
    }
  };

  // Get recording statistics
  const connectedCount = participants.length;
  const recordingCount = participants.filter(p => p.isRecording).length;
  const recordingTimeDisplay = formatRecordingTime(recordingTime);

  // Debug logging for button state
  console.log('Rendering button with isRecordingLocal:', isRecordingLocal);
  console.log('Force render count:', forceRender);

  // Debug logging
  console.log('Current state:', { isRecording, participants: participants.map(p => ({ name: p.name, isRecording: p.isRecording })) });

  return (
    <MainLayout>
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mr-0 sm:mr-4 border-2 hover:bg-gray-50 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Grabando Clase
            </h1>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Voice Recording & Transcription */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Voice Recording Section */}
            <div className="bg-white rounded-lg p-4 lg:p-6" style={{ border: '2px solid #27bd2f' }}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Mic className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Grabación de Voz</h2>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button
                    key={`recording-button-${isRecordingLocal ? 'recording' : 'stopped'}`}
                    onClick={isRecordingLocal ? handleStopRecording : handleStartRecording}
                    className={`${
                      isRecordingLocal
                        ? 'bg-red-600 hover:bg-red-700 shadow-lg scale-105'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base transition-all duration-200 font-semibold w-full sm:w-auto`}
                  >
                    {isRecordingLocal ? (
                      <>
                        <MicOff className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-pulse" />
                        Detener Grabación
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Iniciar Grabación
                      </>
                    )}
                  </Button>

                  {/* Status indicator */}
                  <div className={`flex items-center px-3 lg:px-4 py-2 rounded-lg ${
                    isRecordingLocal
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`} style={{ border: '2px solid #27bd2f' }}>
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      isRecordingLocal ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {isRecordingLocal ? 'Grabando...' : 'Listo'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">
                Graba y gestiona audio de profesores y estudiantes
              </p>

              {/* Language Selection */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <p className="text-sm text-gray-500 mb-2">Elige el idioma</p>
                <Select value={selectedLanguages[0]} onValueChange={(value) => setSelectedLanguages([value])}>
                  <SelectTrigger className="w-full" style={{ border: '2px solid #27bd2f' }}>
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español (España)</SelectItem>
                    <SelectItem value="fr-FR">Français</SelectItem>
                    <SelectItem value="de-DE">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recording Mode */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Modo de grabación</label>
                <p className="text-sm text-gray-500 mb-3">Elige cómo capturar audio de los participantes</p>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={recordingMode === 'group'}
                      onCheckedChange={(checked) => setRecordingMode(checked ? 'group' : 'individual')}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <span className={`text-sm font-medium ${recordingMode === 'group' ? 'text-green-600' : 'text-gray-500'}`}>
                      Grupo
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={recordingMode === 'individual'}
                      onCheckedChange={(checked) => setRecordingMode(checked ? 'individual' : 'group')}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <span className={`text-sm font-medium ${recordingMode === 'individual' ? 'text-green-600' : 'text-gray-500'}`}>
                      Individual
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                <div className="bg-white rounded-lg p-3 lg:p-4 text-center" style={{ border: '2px solid #27bd2f' }}>
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Conectados</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-800">{connectedCount}</div>
                </div>
                <div className="bg-white rounded-lg p-3 lg:p-4 text-center" style={{ border: '2px solid #27bd2f' }}>
                  <Mic className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Grabando</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-800">{recordingCount}</div>
                </div>
                <div className="bg-white rounded-lg p-3 lg:p-4 text-center" style={{ border: '2px solid #27bd2f' }}>
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Tiempo de grabación</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-800">{recordingTimeDisplay}</div>
                </div>
              </div>
            </div>

            {/* Class Transcription Section */}
            <div className="bg-white rounded-lg p-4 lg:p-6" style={{ border: '2px solid #27bd2f' }}>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <Eye className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Transcripción de Clase</h2>
                {isRecordingLocal && (
                  <Badge variant="destructive" className="ml-0 sm:ml-2">
                    <Mic className="w-3 h-3 mr-1 animate-pulse" />
                    Grabando
                  </Badge>
                )}
              </div>

              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="La transcripción aparecerá aquí en tiempo real mientras grabas. También puedes editar el texto manualmente."
                className="min-h-[200px] text-base leading-relaxed text-gray-600 placeholder:text-gray-400 bg-white"
                style={{ border: '2px solid #27bd2f' }}
                readOnly={isRecordingLocal}
              />

              {isRecordingLocal && (
                <div className="mt-3 text-sm text-green-600 flex items-center">
                  <Mic className="w-4 h-4 mr-2 animate-pulse" />
                  Grabando en tiempo real... Habla ahora y verás la transcripción aparecer automáticamente.
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Class Participants */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm" style={{ border: '2px solid #27bd2f' }}>
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Participantes de la Clase</h2>
              </div>

              <p className="text-gray-600 mb-4 text-sm lg:text-base">
                Graba y gestiona audio de profesores y estudiantes
              </p>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white mb-4 lg:mb-6 py-2 lg:py-3">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Participante
              </Button>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6 p-3 lg:p-4 bg-white rounded-lg" style={{ border: '2px solid #27bd2f' }}>
                <div className="text-center">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-800">{participants.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-800">{participants.filter(p => p.type === 'teacher').length}</div>
                  <div className="text-xs text-gray-600">Profesores</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-800">{participants.filter(p => p.type === 'student').length}</div>
                  <div className="text-xs text-gray-600">Estudiantes</div>
                </div>
              </div>

              {/* All Participants List */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Todos los participantes</h3>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg" style={{ border: '2px solid #27bd2f' }}>
                      <img
                        src={sampleParticipants.find(p => p.name === participant.name)?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{participant.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={participant.type === 'teacher' ? 'destructive' : 'secondary'}
                            className="text-xs px-2 py-1"
                          >
                            {participant.type === 'teacher' ? 'Profesor' : 'Estudiante'}
                          </Badge>
                          {participant.isRecording && (
                            <Badge variant="destructive" className="text-xs px-2 py-1">
                              Grabando
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIndividualRecording(participant.id)}
                        className={`${
                          participant.isRecording
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        style={{ border: '2px solid #27bd2f' }}
                      >
                        {participant.isRecording ? (
                          <MicOff className="w-3 h-3" />
                        ) : (
                          <Mic className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClassDetail;
