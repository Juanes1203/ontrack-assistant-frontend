import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ProfessorTabProps {
  classAnalysis: ClassAnalysis | null;
  formatTime?: (time: number) => string;
}

export const ProfessorTab: React.FC<ProfessorTabProps> = ({
  classAnalysis,
  formatTime
}) => {
  if (!classAnalysis) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No hay datos de análisis disponibles. Genera el análisis para ver la evaluación del profesor.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
          Evaluación del Desempeño Docente (Basado en Transcripción)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.transcript ? (
          <div className="space-y-6">
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                🎓 Análisis del Desempeño Detectado en la Grabación
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Basado en la transcripción de {classAnalysis.transcript.length} caracteres, 
                se han identificado {classAnalysis.participacion_estudiantes?.tipos_interaccion?.length || 0} tipos de interacciones 
                y {classAnalysis.momentos_clave?.length || 0} momentos clave en la clase.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {classAnalysis.participacion_estudiantes?.distribucion_participacion?.profesores?.intervenciones || 0}
                </div>
                <p className="text-green-700 font-medium text-sm">Intervenciones del Profesor</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {classAnalysis.momentos_clave?.length || 0}
                </div>
                <p className="text-blue-700 font-medium text-sm">Momentos Clave</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {classAnalysis.teachingPortfolio?.strengths?.length || 0}
                </div>
                <p className="text-orange-700 font-medium text-sm">Fortalezas Identificadas</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {classAnalysis.areas_mejora?.oportunidades?.length || 0}
                </div>
                <p className="text-red-700 font-medium text-sm">Áreas de Mejora</p>
              </div>
            </div>

            {/* Evaluación por Rúbricas */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Evaluación por Rúbricas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-700 mb-2">Dominio del Contenido</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {classAnalysis.rubricEvaluation?.domainKnowledge?.toFixed(1) || '0.0'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-700 mb-2">Metodología</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {classAnalysis.rubricEvaluation?.teachingMethodology?.toFixed(1) || '0.0'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-700 mb-2">Comunicación</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    {classAnalysis.rubricEvaluation?.communicationSkills?.toFixed(1) || '0.0'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Evaluación del desempeño del profesor
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para evaluar el conocimiento y metodología del profesor basado en la transcripción
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
