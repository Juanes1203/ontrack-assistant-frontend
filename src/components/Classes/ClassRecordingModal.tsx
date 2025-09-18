import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Square, FileText, Copy, Check } from 'lucide-react';
import { liveTranscriptionService, LiveTranscriptionResult } from '@/services/liveTranscriptionService';

interface ClassRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRecording: (title: string, description: string) => Promise<void>;
  onStopRecording: (transcript: string, duration: number) => Promise<void>;
  className: string;
  isRecording: boolean;
  recordingTime: number;
  liveTranscript: string;
  transcriptConfidence: number;
}

const ClassRecordingModal: React.FC<ClassRecordingModalProps> = ({
  isOpen,
  onClose,
  onStartRecording,
  onStopRecording,
  className,
  isRecording,
  recordingTime,
  liveTranscript,
  transcriptConfidence
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [manualTranscript, setManualTranscript] = useState('');
  const [useManualTranscript, setUseManualTranscript] = useState(false);
  const [copied, setCopied] = useState(false);

  // Transcript de ejemplo para pegar
  const exampleTranscript = `Profesor: Buenos días estudiantes, hoy vamos a continuar con nuestro tema de álgebra lineal. ¿Recuerdan lo que vimos la clase pasada sobre matrices?

Estudiante: Sí profesor, vimos la suma y multiplicación de matrices.

Profesor: Exacto, muy bien. Hoy vamos a profundizar en un concepto muy importante: los determinantes. El determinante de una matriz es un número especial que nos da información muy valiosa sobre la matriz.

Estudiante: ¿Para qué sirve el determinante profesor?

Profesor: Excelente pregunta. El determinante nos dice si una matriz es invertible, nos ayuda a resolver sistemas de ecuaciones lineales, y también nos da el área o volumen que representa la transformación lineal.

Estudiante: ¿Cómo se calcula el determinante?

Profesor: Para una matriz de 2x2, la fórmula es muy simple: si tenemos la matriz A con elementos a, b, c, d, entonces el determinante es ad menos bc. Vamos a ver un ejemplo.

Estudiante: ¿Puede mostrarnos un ejemplo numérico?

Profesor: Por supuesto. Tomemos la matriz 3, 1, 4, 2. El determinante sería 3 por 2 menos 1 por 4, que es 6 menos 4, igual a 2.

Estudiante: ¿Y para matrices más grandes?

Profesor: Para matrices de 3x3 usamos la regla de Sarrus, y para matrices más grandes usamos el método de Laplace o eliminación gaussiana. Pero hoy nos enfocaremos en matrices 2x2.

Estudiante: ¿Qué pasa si el determinante es cero?

Profesor: Muy buena pregunta. Si el determinante es cero, la matriz no es invertible y el sistema de ecuaciones asociado puede tener infinitas soluciones o ninguna solución.

Estudiante: ¿Puede explicarnos por qué?

Profesor: Claro. Cuando el determinante es cero, significa que las filas de la matriz son linealmente dependientes, es decir, una fila es múltiplo de otra, lo que reduce la información disponible para resolver el sistema.

Estudiante: ¿Hay alguna forma visual de entender esto?

Profesor: Sí, excelente pregunta. Si pensamos en las transformaciones lineales, un determinante cero significa que la transformación colapsa el espacio en una dimensión menor, perdiendo información en el proceso.

Estudiante: ¿Esto se relaciona con los valores propios?

Profesor: ¡Excelente conexión! Sí, los valores propios están directamente relacionados con el determinante. De hecho, el producto de todos los valores propios es igual al determinante de la matriz.

Estudiante: ¿Podemos ver un ejemplo más complejo?

Profesor: Por supuesto. Tomemos la matriz 2, 3, 1, 4. Calculen el determinante. ¿Alguien quiere intentar?

Estudiante: Sería 2 por 4 menos 3 por 1, que es 8 menos 3, igual a 5.

Profesor: ¡Perfecto! Muy bien calculado. Ahora, ¿qué nos dice este determinante de 5?

Estudiante: Que la matriz es invertible.

Profesor: Correcto, y además nos dice que la transformación asociada preserva la orientación y escala el área por un factor de 5.

Estudiante: ¿Qué significa preservar la orientación?

Profesor: Significa que si tenemos un triángulo con vértices en sentido horario, después de la transformación seguirá teniendo los vértices en sentido horario, no se invertirá.

Estudiante: ¿Y si el determinante fuera negativo?

Profesor: Excelente pregunta. Si el determinante es negativo, la transformación invierte la orientación, es decir, convierte figuras en sentido horario en sentido antihorario y viceversa.

Estudiante: ¿Esto tiene aplicaciones prácticas?

Profesor: Absolutamente. Los determinantes se usan en gráficos por computadora, en física para calcular momentos de inercia, en economía para análisis de sistemas, y en muchas otras áreas.

Estudiante: ¿Podemos hacer más ejercicios?

Profesor: Por supuesto. Vamos a practicar con varias matrices. Primero, calculen el determinante de la matriz 1, 2, 3, 4.

Estudiante: Sería 1 por 4 menos 2 por 3, que es 4 menos 6, igual a -2.

Profesor: ¡Excelente! Y como es negativo, ¿qué nos dice?

Estudiante: Que la matriz invierte la orientación.

Profesor: Perfecto. Ahora, ¿qué pasa si tenemos una matriz con determinante muy pequeño, como 0.001?

Estudiante: ¿Significa que la matriz está casi singular?

Profesor: ¡Exacto! Una matriz con determinante muy pequeño está cerca de ser singular, lo que puede causar problemas numéricos en los cálculos.

Estudiante: ¿Cómo podemos evitar estos problemas?

Profesor: Buena pregunta. Podemos usar técnicas de regularización, como agregar un pequeño valor a la diagonal, o usar métodos más robustos como la descomposición QR.

Estudiante: ¿Podemos ver un ejemplo de esto?

Profesor: Claro, pero eso será para la próxima clase. Por hoy, asegúrense de entender bien el concepto de determinante y practiquen con varios ejemplos.

Estudiante: ¿Hay alguna fórmula mnemotécnica para recordar la fórmula del determinante?

Profesor: Sí, pueden pensar en "diagonal principal menos diagonal secundaria" o "arriba izquierda por abajo derecha menos arriba derecha por abajo izquierda".

Estudiante: ¿Y para matrices 3x3?

Profesor: Para 3x3 usamos la regla de Sarrus, que es más compleja pero sigue el mismo principio. La veremos la próxima clase.

Estudiante: ¿Podemos hacer un resumen de lo que aprendimos hoy?

Profesor: Por supuesto. Hoy aprendimos que el determinante es un número que caracteriza una matriz, nos dice si es invertible, preserva o invierte la orientación, y escala el área. Es fundamental para resolver sistemas de ecuaciones y entender transformaciones lineales.

Estudiante: ¿Hay algo más que debamos saber?

Profesor: Sí, practiquen mucho con ejemplos numéricos y traten de visualizar las transformaciones geométricas. La próxima clase veremos determinantes de matrices 3x3 y sus aplicaciones.

Estudiante: ¿Cuándo es la próxima clase?

Profesor: La próxima clase es el miércoles a la misma hora. Traigan sus dudas y estén listos para más ejercicios.

Estudiante: Gracias profesor, la clase estuvo muy clara.

Profesor: De nada, me alegra que hayan entendido. Recuerden hacer los ejercicios del libro, páginas 45 a 50. ¡Hasta el miércoles!`;

  useEffect(() => {
    if (isOpen) {
      setTitle(`${className} - ${new Date().toLocaleString()}`);
      setDescription(`Grabación de clase de ${className}`);
    }
  }, [isOpen, className]);

  const handleStartRecording = async () => {
    try {
      await onStartRecording(title, description);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const finalTranscript = useManualTranscript ? manualTranscript : liveTranscript;
      await onStopRecording(finalTranscript, recordingTime);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const copyExampleTranscript = () => {
    setManualTranscript(exampleTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Grabar Clase: {className}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuración de grabación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título de la Grabación</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Clase de Matemáticas - 18/09/2024"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Clase sobre determinantes"
              />
            </div>
          </div>

          {/* Opciones de transcripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="live-transcription"
                name="transcription-type"
                checked={!useManualTranscript}
                onChange={() => setUseManualTranscript(false)}
                className="w-4 h-4 text-blue-600"
              />
              <Label htmlFor="live-transcription" className="text-base">
                Transcripción en Vivo (Recomendado)
              </Label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="manual-transcription"
                name="transcription-type"
                checked={useManualTranscript}
                onChange={() => setUseManualTranscript(true)}
                className="w-4 h-4 text-blue-600"
              />
              <Label htmlFor="manual-transcription" className="text-base">
                Transcripción Manual (Pegar texto)
              </Label>
            </div>
          </div>

          {/* Campo de transcripción manual */}
          {useManualTranscript && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="manual-transcript">Transcripción de la Clase</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyExampleTranscript}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copiado' : 'Usar Ejemplo'}
                </Button>
              </div>
              <Textarea
                id="manual-transcript"
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder="Pega aquí el transcript de la clase..."
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Puedes pegar un transcript completo de una clase real para probar el análisis de IA.
              </p>
            </div>
          )}

          {/* Estado de grabación */}
          {isRecording && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="font-semibold text-red-800">Grabando...</h3>
                    <p className="text-sm text-red-600">Tiempo: {formatTime(recordingTime)}</p>
                  </div>
                </div>
                <Button onClick={handleStopRecording} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Detener Grabación
                </Button>
              </div>

              {/* Live Transcript */}
              {!useManualTranscript && (
                <div className="mt-4 bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Transcripción en Vivo</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600">
                        Confianza: {Math.round(transcriptConfidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {liveTranscript || 'Iniciando transcripción...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {!isRecording ? (
              <Button onClick={handleStartRecording} className="bg-red-600 hover:bg-red-700">
                <Play className="h-4 w-4 mr-2" />
                Iniciar Grabación
              </Button>
            ) : (
              <Button onClick={handleStopRecording} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Detener Grabación
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassRecordingModal;