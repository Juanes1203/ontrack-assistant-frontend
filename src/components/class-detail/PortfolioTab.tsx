import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface PortfolioTabProps {
  classAnalysis: ClassAnalysis;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({ classAnalysis }) => {
  const portfolioSections = [
    {
      title: 'Fortalezas Identificadas',
      items: classAnalysis.teachingPortfolio.strengths,
      icon: '💪',
      color: 'border-green-400 bg-green-50'
    },
    {
      title: 'Prácticas Innovadoras',
      items: classAnalysis.teachingPortfolio.innovativePractices,
      icon: '💡',
      color: 'border-blue-400 bg-blue-50'
    },
    {
      title: 'Evidencia de Aprendizaje',
      items: classAnalysis.teachingPortfolio.studentLearningEvidence,
      icon: '📊',
      color: 'border-purple-400 bg-purple-50'
    },
    {
      title: 'Reflexiones Pedagógicas',
      items: classAnalysis.teachingPortfolio.reflectiveInsights,
      icon: '🤔',
      color: 'border-orange-400 bg-orange-50'
    }
  ];

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FolderOpen className="w-5 h-5 mr-2 text-gray-700" />
          Portafolio Docente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.teachingPortfolio.strengths.length > 0 ? (
          <div className="space-y-6">
            {portfolioSections.map((section, index) => (
              <div key={index} className={`border-l-4 p-6 rounded-lg ${section.color}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-3 text-2xl">{section.icon}</span>
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
                  <p className="text-gray-500 italic">No se han documentado elementos para esta sección.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Portafolio de Evidencias Docentes
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver la documentación de fortalezas y prácticas pedagógicas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
