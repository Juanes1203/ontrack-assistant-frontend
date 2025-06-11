import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Play, Send, Loader2 } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';
import { elevenLabsService } from '@/services/elevenLabsService';
import { toast } from 'sonner';

interface CriterioEvaluacion {
  nivel: string;
  evidencias: string[];
  recomendaciones: string[];
}

interface CriteriosEvaluacion {
  [categoria: string]: {
    [criterio: string]: CriterioEvaluacion;
  };
}

interface MomentoClave {
  tiempo: string;
  tipo: string;
  descripcion: string;
  impacto: string;
}

interface ParticipacionEstudiantes {
  nivel_participacion: string;
  tipos_interaccion: string[];
  momentos_destacados: string[];
}

interface AreasMejora {
  fortalezas: string[];
  oportunidades: string[];
  recomendaciones_generales: string[];
}

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
    if (!classAnalysis) return;

    try {
      setIsLoading(true);
      
      // Prepare the analysis text
      const analysisText = [
        `Tema: ${classAnalysis.resumen.tema}`,
        `Objetivos: ${classAnalysis.resumen.objetivos}`,
        `Duración: ${classAnalysis.resumen.duracion}`,
        `Participantes: ${classAnalysis.resumen.participantes}`,
        `\nCriterios de Evaluación:`,
        formatCriteriosEvaluacion(classAnalysis.criterios_evaluacion),
        `\nMomentos Clave:`,
        formatMomentosClave(classAnalysis.momentos_clave),
        `\nParticipación de Estudiantes:`,
        formatParticipacionEstudiantes(classAnalysis.participacion_estudiantes),
        `\nÁreas de Mejora:`,
        formatAreasMejora(classAnalysis.areas_mejora)
      ].join('\n\n');

      console.log('Sending analysis to ElevenLabs:', {
        textLength: analysisText.length,
        preview: analysisText.substring(0, 100) + '...'
      });

      const response = await elevenLabsService.createKnowledgeBase(analysisText);
      
      if (response.success) {
        toast.success('Análisis enviado exitosamente a ElevenLabs');
      } else {
        toast.error(response.error || 'Error al enviar el análisis');
      }
    } catch (error) {
      console.error('Error sending to ElevenLabs:', error);
      toast.error('Error al enviar el análisis a ElevenLabs');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones auxiliares para formatear el texto
  const formatCriteriosEvaluacion = (criterios: CriteriosEvaluacion) => {
    const lines: string[] = [];
    for (const [categoria, items] of Object.entries(criterios)) {
      lines.push(`${categoria}:`);
      for (const [criterio, data] of Object.entries(items)) {
        lines.push(`- ${criterio}: ${data.nivel}`);
        lines.push(`  Evidencias: ${data.evidencias.join(', ')}`);
        lines.push(`  Recomendaciones: ${data.recomendaciones.join(', ')}`);
      }
    }
    return lines.join('\n');
  };

  const formatMomentosClave = (momentos: MomentoClave[]) => {
    return momentos.map(momento => 
      `- ${momento.tiempo}: ${momento.tipo}\n  ${momento.descripcion}\n  Impacto: ${momento.impacto}`
    ).join('\n\n');
  };

  const formatParticipacionEstudiantes = (participacion: ParticipacionEstudiantes) => {
    return [
      `Nivel de Participación: ${participacion.nivel_participacion}`,
      `Tipos de Interacción: ${participacion.tipos_interaccion.join(', ')}`,
      `Momentos Destacados: ${participacion.momentos_destacados.join(', ')}`
    ].join('\n');
  };

  const formatAreasMejora = (areas: AreasMejora) => {
    return [
      'Fortalezas:',
      ...areas.fortalezas.map(f => `- ${f}`),
      '',
      'Oportunidades:',
      ...areas.oportunidades.map(o => `- ${o}`),
      '',
      'Recomendaciones Generales:',
      ...areas.recomendaciones_generales.map(r => `- ${r}`)
    ].join('\n');
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
                  <div className="text-gray-600">
                    <div className="mb-2">
                      <span className="font-medium">Profesores:</span>
                      <ul className="list-disc pl-5">
                        {classAnalysis.resumen.participantes.profesores.map((profesor, index) => (
                          <li key={index}>{profesor}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Estudiantes:</span>
                      <ul className="list-disc pl-5">
                        {classAnalysis.resumen.participantes.estudiantes.map((estudiante, index) => (
                          <li key={index}>{estudiante}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
