import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ECDFTabProps {
  classAnalysis: ClassAnalysis;
}

export const ECDFTab: React.FC<ECDFTabProps> = ({ classAnalysis }) => {
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'AVANZADO':
        return 'text-green-600 bg-green-100';
      case 'SATISFACTORIO':
        return 'text-blue-600 bg-blue-100';
      case 'MÍNIMO':
        return 'text-yellow-600 bg-yellow-100';
      case 'INFERIOR':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const criterios = [
    {
      titulo: 'Contexto de Práctica',
      criterios: [
        {
          titulo: 'Comprensión del Contexto',
          data: classAnalysis.criterios_evaluacion.contexto_practica.comprension_contexto
        },
        {
          titulo: 'Flexibilidad de la Práctica',
          data: classAnalysis.criterios_evaluacion.contexto_practica.flexibilidad_practica
        },
        {
          titulo: 'Vinculación con Familias',
          data: classAnalysis.criterios_evaluacion.contexto_practica.vinculacion_familias
        }
      ]
    },
    {
      titulo: 'Reflexión y Planeación',
      criterios: [
        {
          titulo: 'Propósitos Claros',
          data: classAnalysis.criterios_evaluacion.reflexion_planeacion.propositos_claros
        },
        {
          titulo: 'Articulación de Contenidos',
          data: classAnalysis.criterios_evaluacion.reflexion_planeacion.articulacion_contenidos
        },
        {
          titulo: 'Organización del Conocimiento',
          data: classAnalysis.criterios_evaluacion.reflexion_planeacion.organizacion_conocimiento
        }
      ]
    },
    {
      titulo: 'Praxis Pedagógica',
      criterios: [
        {
          titulo: 'Comunicación Docente-Estudiantes',
          data: classAnalysis.criterios_evaluacion.praxis_pedagogica.comunicacion_docente_estudiantes
        },
        {
          titulo: 'Estrategias de Participación',
          data: classAnalysis.criterios_evaluacion.praxis_pedagogica.estrategias_participacion
        },
        {
          titulo: 'Interés de los Estudiantes',
          data: classAnalysis.criterios_evaluacion.praxis_pedagogica.interes_estudiantes
        }
      ]
    },
    {
      titulo: 'Ambiente de Aula',
      criterios: [
        {
          titulo: 'Clima de Respeto',
          data: classAnalysis.criterios_evaluacion.ambiente_aula.clima_respeto
        },
        {
          titulo: 'Toma de Decisiones',
          data: classAnalysis.criterios_evaluacion.ambiente_aula.toma_decisiones
        },
        {
          titulo: 'Estructura y Organización',
          data: classAnalysis.criterios_evaluacion.ambiente_aula.estructura_organizacion
        }
      ]
    }
  ];

  useEffect(() => {
    // Dynamically add the ElevenLabs script if it hasn't been added yet
    if (!document.getElementById("elevenlabs-convai-script")) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.id = "elevenlabs-convai-script";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-teal-600" />
          Evaluación ECDF
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.criterios_evaluacion.contexto_practica.comprension_contexto.nivel !== 'MÍNIMO' ? (
          <div className="space-y-8">
            {criterios.map((seccion, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  {seccion.titulo}
                </h3>
                <div className="grid gap-6">
                  {seccion.criterios.map((criterio, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-medium text-gray-800">
                          {criterio.titulo}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getNivelColor(criterio.data.nivel)}`}>
                          {criterio.data.nivel}
                        </span>
                      </div>
                      
                      {criterio.data.evidencias.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Evidencias:</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {criterio.data.evidencias.map((evidencia, i) => (
                              <li key={i} className="text-gray-600">{evidencia}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {criterio.data.recomendaciones.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Recomendaciones:</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {criterio.data.recomendaciones.map((recomendacion, i) => (
                              <li key={i} className="text-gray-600">{recomendacion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Evaluación ECDF
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver la evaluación detallada
            </p>
          </div>
        )}
        <elevenlabs-convai agent-id="agent_01jwsqvdyeeqkv6jvmrwnw7z2g"></elevenlabs-convai>
      </CardContent>
    </Card>
  );
};
