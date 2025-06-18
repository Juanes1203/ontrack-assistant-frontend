import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ObservationTabProps {
  classAnalysis: ClassAnalysis;
}

export const ObservationTab: React.FC<ObservationTabProps> = ({ classAnalysis }) => {
  const sections = [
    {
      title: 'Planificación y Preparación',
      items: classAnalysis.structuredObservation.planningAndPreparation,
      color: 'border-blue-400 bg-blue-50'
    },
    {
      title: 'Desarrollo Instruccional',
      items: classAnalysis.structuredObservation.instructionalDelivery,
      color: 'border-green-400 bg-green-50'
    },
    {
      title: 'Ambiente del Aula',
      items: classAnalysis.structuredObservation.classroomEnvironment,
      color: 'border-purple-400 bg-purple-50'
    },
    {
      title: 'Responsabilidades Profesionales',
      items: classAnalysis.structuredObservation.professionalResponsibilities,
      color: 'border-orange-400 bg-orange-50'
    }
  ];

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2 text-purple-600" />
          Observación Estructurada
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.structuredObservation.planningAndPreparation.length > 0 ? (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className={`border-l-4 p-6 rounded-lg ${section.color}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {section.title}
                </h3>
                {section.items.length > 0 ? (
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-gray-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No se registraron observaciones específicas para esta área.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Observación Estructurada de la Clase
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver observaciones detalladas por categorías específicas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObservationTab;
