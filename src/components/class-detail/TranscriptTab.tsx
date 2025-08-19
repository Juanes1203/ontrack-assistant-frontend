import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Brain, 
  Download,
  Save,
  Mic,
  Users,
  Edit
} from 'lucide-react';
import { PDFService } from '@/services/pdfService';
import { ClassAnalysis } from '@/types/classAnalysis';
import { useToast } from '@/hooks/use-toast';

interface TranscriptTabProps {
  transcript: string;
  setTranscript: (value: string) => void;
  isRecording: boolean;
  isAnalyzing: boolean;
  generateAnalysis: () => void;
  saveChanges: () => void;
  classAnalysis?: ClassAnalysis;
  className?: string;
  teacher?: string;
  date?: string;
}

// Add custom element type for TypeScript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': any;
    }
  }
}

export const TranscriptTab: React.FC<TranscriptTabProps> = ({
  transcript,
  setTranscript,
  isRecording,
  isAnalyzing,
  generateAnalysis,
  saveChanges,
  classAnalysis,
  className = 'Clase',
  teacher = 'Profesor',
  date = new Date().toLocaleDateString('es-ES')
}) => {
  const { toast } = useToast();

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  const handleExportPDF = async () => {
    if (!classAnalysis) {
      toast({
        title: "Análisis requerido",
        description: "Debes generar el análisis antes de exportar el PDF",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Generando PDF",
        description: "Preparando el reporte completo...",
      });

      await PDFService.generateClassReport({
        className,
        teacher,
        date,
        transcript,
        classAnalysis
      });

      toast({
        title: "PDF generado",
        description: "El reporte se ha descargado exitosamente",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Transcripción de la Clase
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              onClick={generateAnalysis}
              disabled={isAnalyzing || !transcript}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analizando...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generar Análisis
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportPDF}
              disabled={!classAnalysis}
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              style={{
                borderColor: '#bbf7d0',
                backgroundColor: '#f0fdf4'
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={saveChanges} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 bg-white">
        <div className="space-y-4">
          {isRecording && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" style={{
              borderColor: '#dbeafe',
              backgroundColor: '#eff6ff'
            }}>
              <p className="text-blue-700 text-sm flex items-center">
                <Mic className="w-4 h-4 mr-2 animate-pulse" />
                Transcripción en tiempo real activa. El texto aparecerá automáticamente mientras hablas.
              </p>
            </div>
          )}
          
          <div className="relative">
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              <div className="flex items-center text-sm text-gray-600">
                <Edit className="w-4 h-4 mr-2 text-blue-500" />
                <span>Editable</span>
              </div>
            </div>
            <Textarea
              value={transcript}
              onChange={handleTranscriptChange}
              placeholder="La transcripción aparecerá aquí en tiempo real mientras grabas. También puedes editar el texto manualmente. Usa el formato 'Nombre [HH:MM:SS]: Texto' para cada intervención."
              className={`min-h-[400px] border-2 focus:border-blue-400 text-base leading-relaxed text-gray-600 font-medium placeholder:text-gray-400 bg-white ${
                isRecording ? 'border-blue-300' : ''
              }`}
              style={{
                borderColor: isRecording ? '#93c5fd' : '#e5e7eb',
                backgroundColor: '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isRecording ? '#93c5fd' : '#e5e7eb';
              }}
            />
            {transcript && (
              <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  <span>
                    {transcript.split('\n\n').length} {transcript.split('\n\n').length === 1 ? 'participante' : 'participantes'}
                  </span>
                </div>
              </div>
            )}
            {isRecording && (
              <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                Grabando...
              </div>
            )}
          </div>
          
          {transcript && (
            <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                Palabras: {transcript.split(/\s+/).filter(word => word.length > 0).length}
              </div>
              <div>
              Caracteres: {transcript.length}
              </div>
              <div>
                Intervenciones: {transcript.split('\n\n').length}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptTab;
