import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ParticipationTabProps {
  classAnalysis: ClassAnalysis | null;
}

export const ParticipationTab: React.FC<ParticipationTabProps> = ({
  classAnalysis
}) => {
  if (!classAnalysis) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No hay datos de participación disponibles. Graba una clase para ver el análisis.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verificar si los datos de participación están disponibles
  const participacionData = classAnalysis.participacion_estudiantes;
  if (!participacionData) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Los datos de participación no están disponibles. Genera el análisis para ver esta información.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Análisis de Participación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nivel de Participación</h3>
            <p className="text-gray-600 mb-4">{participacionData.nivel_participacion || 'No disponible'}</p>
            
            <h4 className="font-medium text-gray-700 mb-2">Tipos de Interacción</h4>
            {participacionData.tipos_interaccion && participacionData.tipos_interaccion.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 mb-4">
                {participacionData.tipos_interaccion.map((tipo, index) => (
                <li key={index} className="text-gray-600">{tipo}</li>
              ))}
            </ul>
            ) : (
              <p className="text-gray-500 mb-4">No hay tipos de interacción registrados</p>
            )}

            <h4 className="font-medium text-gray-700 mb-2">Momentos Destacados</h4>
            {participacionData.momentos_destacados && participacionData.momentos_destacados.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 mb-4">
                {participacionData.momentos_destacados.map((momento, index) => (
                <li key={index} className="text-gray-600">{momento}</li>
              ))}
            </ul>
            ) : (
              <p className="text-gray-500 mb-4">No hay momentos destacados registrados</p>
            )}

            <h4 className="font-medium text-gray-700 mb-2">Distribución de Participación</h4>
            {participacionData.distribucion_participacion ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Profesores</h5>
                  <p className="text-gray-600">Tiempo total: {participacionData.distribucion_participacion.profesores?.tiempo_total || 'No disponible'}</p>
                  <p className="text-gray-600">Intervenciones: {participacionData.distribucion_participacion.profesores?.intervenciones || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Estudiantes</h5>
                  <p className="text-gray-600">Tiempo total: {participacionData.distribucion_participacion.estudiantes?.tiempo_total || 'No disponible'}</p>
                  <p className="text-gray-600">Intervenciones: {participacionData.distribucion_participacion.estudiantes?.intervenciones || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos de distribución de participación disponibles</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
