import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ECDFTabProps {
  classAnalysis: ClassAnalysis;
}

const getNivelValue = (nivel: string): number => {
  switch (nivel) {
    case 'AVANZADO':
      return 100;
    case 'SATISFACTORIO':
      return 75;
    case 'MÍNIMO':
      return 50;
    case 'INFERIOR':
      return 25;
    default:
      return 0;
  }
};

export const ECDFTab: React.FC<ECDFTabProps> = ({ classAnalysis }) => {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
          Criterios de Evaluación ECDF
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Contexto de la Práctica */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contexto de la Práctica</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Comprensión del Contexto</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.contexto_practica.comprension_contexto.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.contexto_practica.comprension_contexto.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.contexto_practica.comprension_contexto.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.contexto_practica.comprension_contexto.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Flexibilidad de la Práctica</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.contexto_practica.flexibilidad_practica.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.contexto_practica.flexibilidad_practica.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.contexto_practica.flexibilidad_practica.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.contexto_practica.flexibilidad_practica.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Vinculación con Familias</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.contexto_practica.vinculacion_familias.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.contexto_practica.vinculacion_familias.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.contexto_practica.vinculacion_familias.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.contexto_practica.vinculacion_familias.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Reflexión y Planeación */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reflexión y Planeación</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Propósitos Claros</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.propositos_claros.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.reflexion_planeacion.propositos_claros.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.propositos_claros.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.propositos_claros.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Articulación de Contenidos</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.articulacion_contenidos.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.reflexion_planeacion.articulacion_contenidos.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.articulacion_contenidos.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.articulacion_contenidos.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Organización del Conocimiento</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.organizacion_conocimiento.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.reflexion_planeacion.organizacion_conocimiento.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.organizacion_conocimiento.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.reflexion_planeacion.organizacion_conocimiento.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Praxis Pedagógica */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Praxis Pedagógica</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Comunicación Docente-Estudiantes</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.comunicacion_docente_estudiantes.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.praxis_pedagogica.comunicacion_docente_estudiantes.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.comunicacion_docente_estudiantes.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.comunicacion_docente_estudiantes.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Estrategias de Participación</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.estrategias_participacion.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.praxis_pedagogica.estrategias_participacion.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.estrategias_participacion.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.estrategias_participacion.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Interés de los Estudiantes</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.interes_estudiantes.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.praxis_pedagogica.interes_estudiantes.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.interes_estudiantes.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.praxis_pedagogica.interes_estudiantes.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Ambiente del Aula */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ambiente del Aula</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Clima de Respeto</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.clima_respeto.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.ambiente_aula.clima_respeto.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.clima_respeto.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.clima_respeto.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Toma de Decisiones</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.toma_decisiones.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.ambiente_aula.toma_decisiones.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.toma_decisiones.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.toma_decisiones.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">Estructura y Organización</h4>
                  <span className="text-sm font-medium text-gray-600">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.estructura_organizacion.nivel}
                  </span>
                </div>
                <Progress value={getNivelValue(classAnalysis.criterios_evaluacion.ambiente_aula.estructura_organizacion.nivel)} className="h-2" />
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Evidencias</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.estructura_organizacion.evidencias.map((evidencia, index) => (
                      <li key={index} className="text-gray-600">{evidencia}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Recomendaciones</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {classAnalysis.criterios_evaluacion.ambiente_aula.estructura_organizacion.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-gray-600">{recomendacion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
