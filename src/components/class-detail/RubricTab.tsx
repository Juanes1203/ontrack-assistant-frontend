import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ClipboardList } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface RubricTabProps {
  classAnalysis: ClassAnalysis;
}

export const RubricTab: React.FC<RubricTabProps> = ({ classAnalysis }) => {
  const criteria = [
    { key: 'domainKnowledge', label: 'Dominio del Contenido', value: classAnalysis.rubricEvaluation.domainKnowledge },
    { key: 'teachingMethodology', label: 'Metodología de Enseñanza', value: classAnalysis.rubricEvaluation.teachingMethodology },
    { key: 'studentEngagement', label: 'Participación Estudiantil', value: classAnalysis.rubricEvaluation.studentEngagement },
    { key: 'classroomManagement', label: 'Manejo del Aula', value: classAnalysis.rubricEvaluation.classroomManagement },
    { key: 'communicationSkills', label: 'Habilidades de Comunicación', value: classAnalysis.rubricEvaluation.communicationSkills }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-blue-600 bg-blue-100';
    if (score >= 2) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4) return 'Excelente';
    if (score >= 3) return 'Satisfactorio';
    if (score >= 2) return 'En Desarrollo';
    return 'Necesita Mejora';
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
          Evaluación por Rúbricas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.rubricEvaluation.domainKnowledge > 0 ? (
          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div key={criterion.key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{criterion.label}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(criterion.value)}`}>
                    {criterion.value.toFixed(1)} - {getScoreLabel(criterion.value)}
                  </div>
                </div>
                <Progress 
                  value={(criterion.value / 5) * 100} 
                  className="h-3"
                />
              </div>
            ))}
            
            {classAnalysis.rubricEvaluation.comments.length > 0 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Observaciones Detalladas</h3>
                <ul className="space-y-2">
                  {classAnalysis.rubricEvaluation.comments.map((comment, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{comment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Evaluación por Rúbricas
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver la evaluación estructurada por criterios específicos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
