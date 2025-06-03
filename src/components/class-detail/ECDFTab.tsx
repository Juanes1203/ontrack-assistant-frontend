
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ECDFTabProps {
  classAnalysis: ClassAnalysis;
}

export const ECDFTab: React.FC<ECDFTabProps> = ({ classAnalysis }) => {
  const domains = [
    {
      title: 'Conocimiento Disciplinar',
      content: classAnalysis.ecdfModel.domainExpertise,
      icon: '📚'
    },
    {
      title: 'Conocimiento Pedagógico',
      content: classAnalysis.ecdfModel.pedagogicalKnowledge,
      icon: '🎯'
    },
    {
      title: 'Conocimiento del Contexto',
      content: classAnalysis.ecdfModel.contextualKnowledge,
      icon: '🌍'
    },
    {
      title: 'Desarrollo Profesional',
      content: classAnalysis.ecdfModel.professionalDevelopment,
      icon: '📈'
    }
  ];

  const getScoreLabel = (score: number) => {
    if (score >= 4) return { label: 'Destacado', color: 'text-green-600 bg-green-100' };
    if (score >= 3) return { label: 'Satisfactorio', color: 'text-blue-600 bg-blue-100' };
    if (score >= 2) return { label: 'Mínimo', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Insatisfactorio', color: 'text-red-600 bg-red-100' };
  };

  const scoreInfo = getScoreLabel(classAnalysis.ecdfModel.score);

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-red-600" />
          Evaluación ECDF (Colombia)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.ecdfModel.score > 0 ? (
          <div className="space-y-6">
            {/* Puntuación General */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Puntuación General ECDF</h3>
              <div className={`inline-block px-4 py-2 rounded-full text-xl font-bold ${scoreInfo.color}`}>
                {classAnalysis.ecdfModel.score.toFixed(1)} - {scoreInfo.label}
              </div>
              <Progress 
                value={(classAnalysis.ecdfModel.score / 4) * 100} 
                className="h-3 mt-4"
              />
            </div>

            {/* Dominios de Evaluación */}
            <div className="grid gap-6">
              {domains.map((domain, index) => (
                <div key={index} className="border-l-4 border-red-400 bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-3 text-2xl">{domain.icon}</span>
                    {domain.title}
                  </h3>
                  {domain.content ? (
                    <p className="text-gray-700 leading-relaxed">{domain.content}</p>
                  ) : (
                    <p className="text-gray-500 italic">No hay evaluación específica para este dominio.</p>
                  )}
                </div>
              ))}
            </div>

            {/* Información sobre ECDF */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Sobre la Evaluación ECDF</h4>
              <p className="text-sm text-blue-700">
                La Evaluación de Competencias Directivos Docentes y Docentes (ECDF) es el proceso de evaluación 
                que realiza el Estado colombiano para medir las competencias de los educadores del sector público.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Evaluación ECDF Colombia
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver la evaluación según el marco colombiano ECDF
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
