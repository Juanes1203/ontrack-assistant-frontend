
import { useState } from 'react';
import { ClassAnalysis } from '@/types/classAnalysis';
import { useToast } from '@/hooks/use-toast';

export const useAnalysis = () => {
  const { toast } = useToast();
  
  const [classAnalysis, setClassAnalysis] = useState<ClassAnalysis>({
    summary: '',
    strengths: [],
    weaknesses: [],
    opportunities: [],
    studentParticipation: '',
    professorPerformance: '',
    voiceAnalysis: {
      totalSpeakers: 0,
      professorSpeechTime: 0,
      studentSpeechTime: 0,
      questionCount: 0,
      interactionCount: 0
    },
    contentAnalysis: {
      topicsDiscussed: [],
      conceptsExplained: [],
      examplesUsed: [],
      keywordFrequency: {}
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeTranscriptContent = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    const professorKeywords = ['explico', 'enseño', 'vamos a ver', 'como pueden ver', 'recuerden', 'la tarea', 'el examen', 'evaluación', 'calificación'];
    const studentKeywords = ['profesor', 'maestro', 'no entiendo', 'una pregunta', 'puedo preguntar', 'disculpe', 'gracias'];
    const questionPatterns = /\b(qué|cómo|cuándo|dónde|por qué|para qué|cuál)\b.*\?/gi;
    const explanationPatterns = /\b(es decir|por ejemplo|como|significa|definimos|concepto de|teoría de)\b/gi;
    
    const questions = text.match(questionPatterns) || [];
    const questionCount = questions.length;
    
    const explanations = text.match(explanationPatterns) || [];
    
    const keywordFrequency: {[key: string]: number} = {};
    const importantWords = words.filter(word => word.length > 4);
    importantWords.forEach(word => {
      keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
    });
    
    const professorIndicators = professorKeywords.reduce((count, keyword) => 
      count + (text.toLowerCase().split(keyword).length - 1), 0);
    const studentIndicators = studentKeywords.reduce((count, keyword) => 
      count + (text.toLowerCase().split(keyword).length - 1), 0);
    
    const topicsDiscussed = [];
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('react') || lowerText.includes('componente')) topicsDiscussed.push('React y Componentes');
    if (lowerText.includes('javascript') || lowerText.includes('js')) topicsDiscussed.push('JavaScript');
    if (lowerText.includes('html') || lowerText.includes('css')) topicsDiscussed.push('HTML/CSS');
    if (lowerText.includes('estado') || lowerText.includes('state')) topicsDiscussed.push('Gestión de Estado');
    if (lowerText.includes('props') || lowerText.includes('propiedades')) topicsDiscussed.push('Props y Propiedades');
    if (lowerText.includes('hook') || lowerText.includes('usestate') || lowerText.includes('useeffect')) topicsDiscussed.push('React Hooks');
    if (lowerText.includes('función') || lowerText.includes('método')) topicsDiscussed.push('Funciones y Métodos');
    if (lowerText.includes('variable') || lowerText.includes('constante')) topicsDiscussed.push('Variables y Constantes');
    if (lowerText.includes('clase') || lowerText.includes('programación')) topicsDiscussed.push('Programación');
    if (lowerText.includes('algoritmo') || lowerText.includes('lógica')) topicsDiscussed.push('Algoritmos y Lógica');
    
    if (topicsDiscussed.length === 0) {
      const wordFreq = Object.entries(keywordFrequency).sort(([,a], [,b]) => (b as number) - (a as number));
      const mainWords = wordFreq.slice(0, 3).map(([word]) => word);
      if (mainWords.length > 0) {
        topicsDiscussed.push(`Conceptos: ${mainWords.join(', ')}`);
      }
    }
    
    const examplesUsed = [];
    if (lowerText.includes('por ejemplo') || lowerText.includes('ejemplo')) examplesUsed.push('Ejemplos verbales');
    if (lowerText.includes('demo') || lowerText.includes('demostración')) examplesUsed.push('Demostración práctica');
    if (lowerText.includes('código') || lowerText.includes('program')) examplesUsed.push('Ejemplos de código');
    if (lowerText.includes('práctica') || lowerText.includes('ejercicio')) examplesUsed.push('Ejercicios prácticos');
    
    return {
      questionCount,
      explanationCount: explanations.length,
      professorIndicators,
      studentIndicators,
      keywordFrequency,
      topicsDiscussed,
      examplesUsed,
      sentenceCount: sentences.length,
      wordCount: words.length,
      actualQuestions: questions,
      mainWords: Object.entries(keywordFrequency).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5)
    };
  };

  const generateAnalysis = async (transcript: string, recordingTime: number, formatTime: (seconds: number) => string) => {
    if (!transcript.trim()) {
      toast({
        title: "Error",
        description: "Necesitas tener una transcripción para generar el análisis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    const analysis = analyzeTranscriptContent(transcript);
    
    setTimeout(() => {
      let summary = '';
      
      summary += `Durante la sesión de ${formatTime(recordingTime)}, se registraron ${analysis.wordCount} palabras y ${analysis.sentenceCount} oraciones. `;
      
      if (analysis.topicsDiscussed.length > 0) {
        summary += `Los principales temas abordados fueron: ${analysis.topicsDiscussed.join(', ')}. `;
      } else if (analysis.mainWords.length > 0) {
        const mainConcepts = analysis.mainWords.map(([word]) => word).join(', ');
        summary += `Los conceptos más mencionados durante la clase fueron: ${mainConcepts}. `;
      }
      
      if (analysis.questionCount > 0) {
        summary += `Se identificaron ${analysis.questionCount} preguntas o cuestionamientos durante la sesión`;
        if (analysis.actualQuestions.length > 0) {
          summary += `, incluyendo: "${analysis.actualQuestions[0].substring(0, 50)}..."`;
        }
        summary += '. ';
        
        if (analysis.questionCount >= 5) {
          summary += "Esto indica un alto nivel de interacción y engagement por parte de los participantes. ";
        } else if (analysis.questionCount >= 2) {
          summary += "Esto muestra un nivel moderado de participación activa. ";
        } else {
          summary += "Esto sugiere una participación inicial que podría incrementarse. ";
        }
      } else {
        summary += "No se detectaron preguntas directas en la transcripción, sugiriendo un formato más expositivo. ";
      }
      
      if (analysis.explanationCount > 0) {
        summary += `Se registraron ${analysis.explanationCount} instancias de explicaciones detalladas o ejemplificaciones, `;
        summary += "mostrando un enfoque pedagógico estructurado. ";
      }
      
      const totalIndicators = analysis.professorIndicators + analysis.studentIndicators;
      if (totalIndicators > 0) {
        const professorPercentage = Math.round((analysis.professorIndicators / totalIndicators) * 100);
        const studentPercentage = Math.round((analysis.studentIndicators / totalIndicators) * 100);
        
        if (studentPercentage >= 40) {
          summary += `La sesión mostró un equilibrio saludable con ${professorPercentage}% de instrucción docente y ${studentPercentage}% de participación estudiantil.`;
        } else if (studentPercentage >= 20) {
          summary += `La clase fue mayormente dirigida por el instructor (${professorPercentage}%) con participación estudiantil moderada (${studentPercentage}%).`;
        } else {
          summary += `La sesión fue predominantemente expositiva con ${professorPercentage}% de instrucción docente y participación estudiantil limitada.`;
        }
      } else {
        summary += "La transcripción refleja principalmente contenido académico sin indicadores claros de roles específicos.";
      }

      const strengths = [];
      if (analysis.questionCount >= 3) strengths.push(`Excelente interacción: ${analysis.questionCount} preguntas registradas demuestran engagement activo`);
      if (analysis.explanationCount >= 2) strengths.push(`Metodología efectiva: ${analysis.explanationCount} explicaciones detalladas registradas`);
      if (analysis.topicsDiscussed.length >= 3) strengths.push(`Cobertura amplia: ${analysis.topicsDiscussed.length} temas diferentes abordados`);
      if (analysis.wordCount > 200) strengths.push(`Contenido sustancial: ${analysis.wordCount} palabras registradas indican profundidad temática`);
      if (analysis.sentenceCount > 10) strengths.push(`Comunicación estructurada: ${analysis.sentenceCount} oraciones bien formadas`);
      
      if (strengths.length === 0) {
        if (analysis.wordCount > 50) {
          strengths.push("Transmisión clara de información académica");
        } else {
          strengths.push("Sesión registrada con contenido básico");
        }
      }

      const weaknesses = [];
      if (analysis.questionCount === 0) weaknesses.push("Ausencia total de preguntas: no se detectó verificación de comprensión");
      if (analysis.explanationCount === 0) weaknesses.push("Falta de ejemplificación: no se registraron explicaciones detalladas");
      if (analysis.studentIndicators === 0) weaknesses.push("Sin participación estudiantil detectada en la transcripción");
      if (analysis.wordCount < 100) weaknesses.push(`Contenido limitado: solo ${analysis.wordCount} palabras para ${formatTime(recordingTime)} de duración`);
      if (analysis.topicsDiscussed.length <= 1) weaknesses.push("Cobertura temática restringida detectada en el contenido");
      
      if (weaknesses.length === 0) {
        weaknesses.push("Oportunidad de incrementar la interacción bidireccional registrada");
      }

      const opportunities = [];
      if (analysis.questionCount < 2) opportunities.push("Implementar técnicas para generar más preguntas y verificación de comprensión");
      if (analysis.explanationCount < 2) opportunities.push("Incorporar más ejemplos prácticos y casos de estudio detallados");
      if (analysis.studentIndicators < analysis.professorIndicators * 0.3) opportunities.push("Desarrollar estrategias para aumentar la participación estudiantil registrable");
      opportunities.push("Enriquecer el contenido con actividades que generen más interacción verbal");
      if (analysis.examplesUsed.length === 0) opportunities.push("Integrar ejemplos prácticos y demostraciones más evidentes");

      let studentParticipation = '';
      if (analysis.studentIndicators > 0) {
        studentParticipation = `Se detectaron ${analysis.studentIndicators} indicadores de participación estudiantil en la transcripción. `;
      } else {
        studentParticipation = 'La transcripción no muestra indicadores claros de participación estudiantil directa. ';
      }
      if (analysis.questionCount > 0) {
        studentParticipation += `Los estudiantes formularon ${analysis.questionCount} preguntas durante la sesión, `;
      } else {
        studentParticipation += 'No se registraron preguntas por parte de los estudiantes, ';
      }
      if (analysis.studentIndicators >= 3) {
        studentParticipation += 'demostrando un ambiente de aprendizaje interactivo donde los estudiantes se sienten cómodos participando.';
      } else if (analysis.studentIndicators >= 1) {
        studentParticipation += 'sugiriendo oportunidades para fomentar mayor participación activa.';
      } else {
        studentParticipation += 'indicando la necesidad de implementar estrategias más dinámicas para estimular el engagement estudiantil.';
      }

      let professorPerformance = '';
      if (analysis.professorIndicators > 0) {
        professorPerformance = `Se identificaron ${analysis.professorIndicators} indicadores de instrucción estructurada en la transcripción. `;
      } else {
        professorPerformance = 'El análisis no detectó indicadores claros de metodología docente estructurada. ';
      }
      if (analysis.explanationCount > 0) {
        professorPerformance += `El profesor proporcionó ${analysis.explanationCount} explicaciones detalladas, `;
      } else {
        professorPerformance += 'No se registraron explicaciones detalladas en la transcripción, ';
      }
      if (analysis.topicsDiscussed.length > 0) {
        professorPerformance += `cubriendo ${analysis.topicsDiscussed.length} temas principales: ${analysis.topicsDiscussed.join(', ')}. `;
      } else {
        professorPerformance += 'con cobertura temática limitada detectada. ';
      }
      if (analysis.professorIndicators >= 3 && analysis.explanationCount >= 2) {
        professorPerformance += 'Esto indica un desempeño docente sólido con metodología clara y contenido bien estructurado.';
      } else {
        professorPerformance += 'Hay oportunidades para enriquecer la metodología de enseñanza y aumentar la claridad en las explicaciones.';
      }

      setClassAnalysis({
        summary,
        strengths,
        weaknesses,
        opportunities,
        studentParticipation,
        professorPerformance,
        voiceAnalysis: {
          totalSpeakers: Math.max(1, Math.ceil((analysis.professorIndicators + analysis.studentIndicators) / 2)),
          professorSpeechTime: Math.round((analysis.professorIndicators / (analysis.professorIndicators + analysis.studentIndicators + 1)) * recordingTime),
          studentSpeechTime: Math.round((analysis.studentIndicators / (analysis.professorIndicators + analysis.studentIndicators + 1)) * recordingTime),
          questionCount: analysis.questionCount,
          interactionCount: analysis.professorIndicators + analysis.studentIndicators
        },
        contentAnalysis: {
          topicsDiscussed: analysis.topicsDiscussed,
          conceptsExplained: analysis.mainWords.map(([word]) => word),
          examplesUsed: analysis.examplesUsed,
          keywordFrequency: analysis.keywordFrequency
        }
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Análisis completado",
        description: `Análisis generado basado en ${analysis.wordCount} palabras de la transcripción real`,
      });
    }, 3000);
  };

  const resetAnalysis = () => {
    setClassAnalysis({
      summary: '',
      strengths: [],
      weaknesses: [],
      opportunities: [],
      studentParticipation: '',
      professorPerformance: '',
      voiceAnalysis: {
        totalSpeakers: 0,
        professorSpeechTime: 0,
        studentSpeechTime: 0,
        questionCount: 0,
        interactionCount: 0
      },
      contentAnalysis: {
        topicsDiscussed: [],
        conceptsExplained: [],
        examplesUsed: [],
        keywordFrequency: {}
      }
    });
  };

  return {
    classAnalysis,
    isAnalyzing,
    generateAnalysis,
    resetAnalysis
  };
};
