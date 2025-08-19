import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  BookOpen,
  ClipboardList,
  Clock,
  Mic
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useClass } from '@/contexts/ClassContext';
import { classService } from '@/services/classService';

import { RecordingControls } from '@/components/class-detail/RecordingControls';
import { TranscriptTab } from '@/components/class-detail/TranscriptTab';
import { SummaryTab } from '@/components/class-detail/SummaryTab';
import { ECDFTab } from '@/components/class-detail/ECDFTab';
import { ParticipationTab } from '@/components/class-detail/ParticipationTab';
import { MomentsTab } from '@/components/class-detail/MomentsTab';
import { useRecording } from '@/components/class-detail/useRecording';
import { useAnalysis } from '@/components/class-detail/useAnalysis';
import { MultiLanguageSelector } from '@/components/class-detail/MultiLanguageSelector';
import { WhisperXUploader } from '@/components/class-detail/WhisperXUploader';
import { WhisperXTest } from '@/components/class-detail/WhisperXTest';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getClassById } = useClass();
  const [selectedLanguages, setSelectedLanguages] = useState(['en-US', 'es-ES']);
  const [activeTab, setActiveTab] = useState('whisperx');
  
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

  const [analysisInitialized, setAnalysisInitialized] = useState(false);
  const {
    classAnalysis,
    isAnalyzing,
    generateAnalysis,
    resetAnalysis,
    setClassAnalysis
  } = useAnalysis();

  useEffect(() => {
    if (
      classData &&
      classData.analysis_data &&
      !analysisInitialized
    ) {
      try {
        const parsed = typeof classData.analysis_data === 'string'
          ? JSON.parse(classData.analysis_data)
          : classData.analysis_data;
        setClassAnalysis(parsed);
        if (parsed.transcript) {
          setTranscript(parsed.transcript);
        }
        setAnalysisInitialized(true);
      } catch (e) {
        // Si falla el parseo, no pasa nada
      }
    }
  }, [classData, analysisInitialized, setClassAnalysis, setTranscript]);

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

  const handleGenerateAnalysis = async () => {
    try {
      // Generar el análisis y guardarlo automáticamente
      await generateAnalysis(transcript, classId);
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el análisis. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleResetRecording = () => {
    setTranscript('');
    resetAnalysis();
  };

  const handleLanguageChange = (newLanguages: string[]) => {
    setSelectedLanguages(newLanguages);
    const languageNames = newLanguages.map(lang => {
      const langMap: { [key: string]: string } = {
        'en-US': 'English (US)',
        'en-GB': 'English (UK)',
        'es-ES': 'Español (España)',
        'es-MX': 'Español (México)',
        'fr-FR': 'Français',
        'de-DE': 'Deutsch',
        'it-IT': 'Italiano',
        'pt-BR': 'Português (Brasil)',
        'ja-JP': '日本語',
        'ko-KR': '한국어',
        'zh-CN': '中文 (简体)',
        'zh-TW': '中文 (繁體)'
      };
      return langMap[lang] || lang;
    }).join(', ');
    
    toast({
      title: "Idiomas actualizados",
      description: `Reconocimiento configurado para: ${languageNames}`,
    });
  };

  const saveChanges = async () => {
    if (!classId || !classAnalysis) {
      toast({
        title: "Error",
        description: "No hay análisis para guardar.",
        variant: "destructive",
      });
      return;
    }

    try {
      await classService.updateAnalysisData(classId, classAnalysis);
      toast({
        title: "Cambios guardados",
        description: "El análisis se ha guardado correctamente en la base de datos.",
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el análisis. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Determinar el transcript a mostrar: si hay análisis, usar ese; si no, usar el transcript del estado
  const transcriptToShow = classAnalysis && classAnalysis.transcript && classAnalysis.transcript.length > 0
    ? classAnalysis.transcript
    : transcript;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8 relative z-40">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4 border-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {classData.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {classData.teacher}
              </span>
              <span>{classData.created_at ? new Date(classData.created_at).toLocaleDateString() : ''}</span>
              <Badge variant="secondary">Clase</Badge>
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="mb-6 relative z-40">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Controles de Grabación</h2>
            <MultiLanguageSelector 
              selectedLanguages={selectedLanguages} 
              onLanguagesChange={handleLanguageChange} 
            />
          </div>
          <RecordingControls
            isRecording={isRecording}
            participants={participants}
            startRecording={startRecording}
            stopRecording={stopRecording}
            addParticipant={addParticipant}
            removeParticipant={removeParticipant}
          />
        </div>

        {/* Main Tabs */}
        <div className="space-y-6 relative z-40">
          <div className="grid w-full grid-cols-7 h-12 gap-1 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('whisperx')}
              className={`flex items-center justify-center text-xs rounded-md transition-colors ${
                activeTab === 'whisperx' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Mic className="w-4 h-4 mr-1" />
              WhisperX
            </button>
            <button 
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center justify-center text-xs rounded-md transition-colors ${
                activeTab === 'transcript' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FileText className="w-4 h-4 mr-1" />
              Transcripción
            </button>
            <button 
              onClick={() => setActiveTab('resumen')}
              className={`flex items-center justify-center text-xs rounded-md transition-colors ${
                activeTab === 'resumen' 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-green-500 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Resumen
            </button>
            <button 
              onClick={() => setActiveTab('criterios')}
              className={`flex items-center justify-center text-xs rounded-md transition-colors ${
                activeTab === 'criterios' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-purple-500 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <ClipboardList className="w-4 h-4 mr-1" />
              Criterios ECDF
            </button>
            <button 
              onClick={() => setActiveTab('momentos')}
              className={`flex items-center justify-center text-xs rounded-md transition-colors ${
                activeTab === 'momentos' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <Clock className="w-4 h-4 mr-1" />
              Momentos Clave
            </button>
            <button 
              onClick={() => setActiveTab('participacion')}
              className={`flex items-center justify-center text-xs rounded-md transition-colors ${
                activeTab === 'participacion' 
                  ? 'bg-pink-100 text-pink-700' 
                  : 'text-pink-500 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              <Users className="w-4 h-4 mr-1" />
              Participación
            </button>
            <button 
              onClick={() => setActiveTab('whisperx-test')}
              className={`flex items-center justify-center text-xs rounded-md transition-colors ${
                activeTab === 'whisperx-test' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-red-500 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Mic className="w-4 h-4 mr-1" />
              Test
            </button>
          </div>

          {activeTab === 'whisperx' && (
            <div className="relative z-10">
              <WhisperXUploader
                onTranscriptionComplete={(transcript, speakers, participation) => {
                  console.log('WhisperX transcription completed:', { transcript, speakers, participation });
                  setTranscript(transcript);
                  toast({
                    title: "Transcripción completada",
                    description: `Se identificaron ${speakers.length} hablantes`,
                  });
                }}
                className="w-full"
              />
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="relative z-10">
            <TranscriptTab
              transcript={transcriptToShow}
              setTranscript={setTranscript}
              isRecording={isRecording}
              isAnalyzing={isAnalyzing}
              generateAnalysis={handleGenerateAnalysis}
              saveChanges={saveChanges}
              classAnalysis={classAnalysis}
              className={classData.name}
              teacher={classData.teacher}
              date={classData.created_at ? new Date(classData.created_at).toLocaleDateString('es-ES') : ''}
            />
            </div>
          )}

          {activeTab === 'resumen' && (
            <div className="relative z-10">
            <SummaryTab
              classAnalysis={classAnalysis}
            />
            </div>
          )}

          {activeTab === 'criterios' && (
            <div className="relative z-10">
            <ECDFTab classAnalysis={classAnalysis} />
            </div>
          )}

          {activeTab === 'momentos' && (
            <div className="relative z-10">
            <MomentsTab classAnalysis={classAnalysis} />
            </div>
          )}

          {activeTab === 'participacion' && (
            <div className="relative z-10">
            <ParticipationTab
              classAnalysis={classAnalysis}
            />
            </div>
          )}

          {activeTab === 'whisperx-test' && (
            <div className="relative z-10">
              <WhisperXTest />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
