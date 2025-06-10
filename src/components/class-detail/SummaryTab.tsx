import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Play, Send, Loader2 } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';
import { elevenLabsService } from '@/services/elevenLabsService';
import { toast } from 'sonner';

interface SummaryTabProps {
  classAnalysis: ClassAnalysis;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ classAnalysis }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleElevenLabs = async () => {
    if (!classAnalysis.transcript) {
      toast.error('No hay transcripción disponible para convertir a voz');
      return;
    }

    setIsLoading(true);
    try {
      const response = await elevenLabsService.textToSpeech(classAnalysis.transcript);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setAudioUrl(response.audio);
      toast.success('Audio generado exitosamente');
    } catch (error) {
      toast.error('Error al generar el audio');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToElevenLabs = async () => {
    if (!classAnalysis.transcript) {
      toast.error('No hay análisis disponible para enviar');
      return;
    }

    setIsLoading(true);
    try {
      // Preparar el texto del análisis
      const analysisText = `
        Tema: ${classAnalysis.resumen.tema}
        Objetivos: ${classAnalysis.resumen.objetivos}
        Duración: ${classAnalysis.resumen.duracion}
        Participantes: ${classAnalysis.resumen.participantes}

        Criterios de Evaluación:
        ${JSON.stringify(classAnalysis.criterios_evaluacion, null, 2)}

        Momentos Clave:
        ${JSON.stringify(classAnalysis.momentos_clave, null, 2)}

        Participación Estudiantil:
        ${JSON.stringify(classAnalysis.participacion_estudiantes, null, 2)}

        Áreas de Mejora:
        ${JSON.stringify(classAnalysis.areas_mejora, null, 2)}
      `;

      const response = await elevenLabsService.createKnowledgeBase(analysisText);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success('Análisis enviado exitosamente a ElevenLabs');
    } catch (error) {
      toast.error('Error al enviar el análisis');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2 text-teal-600" />
          Resumen de la Clase
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.resumen.tema ? (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Información General</h3>
          <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Tema</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.tema}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Objetivos</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.objetivos}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Duración</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.duracion}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Participantes</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.participantes}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-700 mb-2">Duración de la Clase</h4>
                <p className="text-2xl font-semibold text-teal-600">{classAnalysis.resumen.duracion}</p>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-700 mb-2">Palabras Transcritas</h4>
                <p className="text-2xl font-semibold text-teal-600">
                  {classAnalysis.transcript.split(/\s+/).length}
                </p>
              </div>
            </div>

            {classAnalysis.areas_mejora && (
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Áreas de Mejora</h3>
                <div className="space-y-4">
                  {classAnalysis.areas_mejora.fortalezas && (
                    <div>
                      <h4 className="font-medium text-gray-700">Fortalezas</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {classAnalysis.areas_mejora.fortalezas.map((fortaleza, index) => (
                          <li key={index} className="text-gray-600">{fortaleza}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {classAnalysis.areas_mejora.oportunidades && (
                    <div>
                      <h4 className="font-medium text-gray-700">Oportunidades</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {classAnalysis.areas_mejora.oportunidades.map((oportunidad, index) => (
                          <li key={index} className="text-gray-600">{oportunidad}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {classAnalysis.areas_mejora.recomendaciones_generales && (
                    <div>
                      <h4 className="font-medium text-gray-700">Recomendaciones Generales</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {classAnalysis.areas_mejora.recomendaciones_generales.map((recomendacion, index) => (
                          <li key={index} className="text-gray-600">{recomendacion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSendToElevenLabs}
                disabled={isLoading || !classAnalysis.transcript}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando Información...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Información
                  </>
                )}
              </Button>
            </div>

            {audioUrl && (
              <div className="mt-4">
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Resumen de la Clase
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver el resumen detallado
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
