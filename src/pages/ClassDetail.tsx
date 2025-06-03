
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  BookOpen,
  Target,
  UserCheck,
  GraduationCap,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useClass } from '@/contexts/ClassContext';

import { RecordingControls } from '@/components/class-detail/RecordingControls';
import { TranscriptTab } from '@/components/class-detail/TranscriptTab';
import { SummaryTab } from '@/components/class-detail/SummaryTab';
import { SwotTab } from '@/components/class-detail/SwotTab';
import { ParticipationTab } from '@/components/class-detail/ParticipationTab';
import { ProfessorTab } from '@/components/class-detail/ProfessorTab';
import { InsightsTab } from '@/components/class-detail/InsightsTab';
import { useRecording } from '@/components/class-detail/useRecording';
import { useAnalysis } from '@/components/class-detail/useAnalysis';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getClassById } = useClass();
  
  // Get class data from context
  const classData = getClassById(classId || '');
  
  // Custom hooks
  const {
    isRecording,
    isPaused,
    recordingTime,
    transcript,
    isListening,
    setTranscript,
    startRecording,
    stopRecording,
    pauseRecording,
    resetRecording,
    formatTime
  } = useRecording();

  const {
    classAnalysis,
    isAnalyzing,
    generateAnalysis,
    resetAnalysis
  } = useAnalysis();

  // If class not found, show error
  if (!classData) {
    return (
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
    );
  }

  const handleGenerateAnalysis = () => {
    generateAnalysis(transcript, recordingTime, formatTime);
  };

  const handleResetRecording = () => {
    resetRecording();
    resetAnalysis();
  };

  const saveChanges = () => {
    toast({
      title: "Cambios guardados",
      description: "Los cambios se han guardado correctamente",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4 border-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {classData.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {classData.teacher}
              </span>
              <span>{classData.day} - {classData.time}</span>
              <Badge variant="secondary">{classData.subject}</Badge>
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <RecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          recordingTime={recordingTime}
          isListening={isListening}
          formatTime={formatTime}
          startRecording={startRecording}
          stopRecording={stopRecording}
          pauseRecording={pauseRecording}
          resetRecording={handleResetRecording}
        />

        {/* Main Tabs */}
        <Tabs defaultValue="transcript" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-12 gap-1">
            <TabsTrigger value="transcript" className="flex items-center text-xs">
              <FileText className="w-4 h-4 mr-1" />
              Transcripción
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center text-xs">
              <BookOpen className="w-4 h-4 mr-1" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="swot" className="flex items-center text-xs">
              <Target className="w-4 h-4 mr-1" />
              FODA
            </TabsTrigger>
            <TabsTrigger value="participation" className="flex items-center text-xs">
              <UserCheck className="w-4 h-4 mr-1" />
              Participación
            </TabsTrigger>
            <TabsTrigger value="professor" className="flex items-center text-xs">
              <GraduationCap className="w-4 h-4 mr-1" />
              Profesor
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center text-xs">
              <TrendingUp className="w-4 h-4 mr-1" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcript">
            <TranscriptTab
              transcript={transcript}
              setTranscript={setTranscript}
              isRecording={isRecording}
              isAnalyzing={isAnalyzing}
              generateAnalysis={handleGenerateAnalysis}
              saveChanges={saveChanges}
            />
          </TabsContent>

          <TabsContent value="summary">
            <SummaryTab
              classAnalysis={classAnalysis}
              recordingTime={recordingTime}
              transcript={transcript}
              formatTime={formatTime}
            />
          </TabsContent>

          <TabsContent value="swot">
            <SwotTab classAnalysis={classAnalysis} />
          </TabsContent>

          <TabsContent value="participation">
            <ParticipationTab
              classAnalysis={classAnalysis}
              formatTime={formatTime}
            />
          </TabsContent>

          <TabsContent value="professor">
            <ProfessorTab
              classAnalysis={classAnalysis}
              formatTime={formatTime}
            />
          </TabsContent>

          <TabsContent value="insights">
            <InsightsTab
              classAnalysis={classAnalysis}
              recordingTime={recordingTime}
              transcript={transcript}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassDetail;
