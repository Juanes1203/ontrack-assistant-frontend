import { useState } from 'react';
import { ClassAnalysis } from '@/types/classAnalysis';
import { useToast } from '@/hooks/use-toast';

export const useAnalysis = () => {
  const { toast } = useToast();
  
  const [classAnalysis, setClassAnalysis] = useState<ClassAnalysis>({
    summary: '',
    rubricEvaluation: {
      domainKnowledge: 0,
      teachingMethodology: 0,
      studentEngagement: 0,
      classroomManagement: 0,
      communicationSkills: 0,
      comments: []
    },
    structuredObservation: {
      planningAndPreparation: [],
      instructionalDelivery: [],
      classroomEnvironment: [],
      professionalResponsibilities: []
    },
    feedback360: {
      selfEvaluation: [],
      studentPerspective: [],
      peerObservations: [],
      improvementAreas: []
    },
    teachingPortfolio: {
      strengths: [],
      innovativePractices: [],
      studentLearningEvidence: [],
      reflectiveInsights: []
    },
    ecdfModel: {
      domainExpertise: '',
      pedagogicalKnowledge: '',
      contextualKnowledge: '',
      professionalDevelopment: '',
      score: 0
    },
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
      mainWords: Object.entries(keywordFrequency).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5),
      actualContent: text.trim()
    };
  };

  const generateContentBasedSummary = (text: string, analysis: any, recordingTime: number, formatTime: (seconds: number) => string) => {
    if (!text.trim() || analysis.wordCount < 5) {
      return "No se detectó contenido suficiente en la transcripción para generar un resumen detallado. Asegúrate de que la grabación capture audio claro y que haya contenido hablado durante la sesión.";
    }

    let summary = "";
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const firstSentences = sentences.slice(0, 3).map(s => s.trim()).join('. ');
    
    if (firstSentences) {
      summary += `Durante la sesión de ${formatTime(recordingTime)}, se abordó el siguiente contenido: "${firstSentences}". `;
    }

    if (analysis.topicsDiscussed.length > 0) {
      summary += `Los temas principales identificados fueron: ${analysis.topicsDiscussed.join(', ')}. `;
    }

    if (analysis.mainWords.length > 0) {
      const keyTerms = analysis.mainWords.slice(0, 3).map(([word, count]) => `${word} (${count} veces)`).join(', ');
      summary += `Los términos más mencionados durante la clase fueron: ${keyTerms}. `;
    }

    if (analysis.questionCount > 0) {
      summary += `Se registraron ${analysis.questionCount} preguntas o cuestionamientos`;
      if (analysis.actualQuestions.length > 0) {
        const firstQuestion = analysis.actualQuestions[0].substring(0, 80) + "...";
        summary += `, incluyendo: "${firstQuestion}"`;
      }
      summary += '. ';
    }

    if (analysis.explanationCount > 0) {
      summary += `Se identificaron ${analysis.explanationCount} explicaciones o ejemplificaciones durante la sesión. `;
    }

    summary += `El contenido transcrito incluyó ${analysis.wordCount} palabras distribuidas en ${analysis.sentenceCount} oraciones, `;
    
    const totalIndicators = analysis.professorIndicators + analysis.studentIndicators;
    if (totalIndicators > 0) {
      const professorPercentage = Math.round((analysis.professorIndicators / totalIndicators) * 100);
      summary += `con un ${professorPercentage}% de contenido de tipo instructivo y ${100 - professorPercentage}% de participación o interacción.`;
    } else {
      summary += "con un formato principalmente de contenido académico o informativo.";
    }

    return summary;
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
      const summary = generateContentBasedSummary(transcript, analysis, recordingTime, formatTime);

      // Generar evaluación por rúbricas basada en el análisis
      const rubricEvaluation = {
        domainKnowledge: Math.min(5, 2 + (analysis.explanationCount * 0.5) + (analysis.topicsDiscussed.length * 0.3)),
        teachingMethodology: Math.min(5, 2 + (analysis.professorIndicators * 0.1) + (analysis.explanationCount * 0.4)),
        studentEngagement: Math.min(5, 1 + (analysis.questionCount * 0.3) + (analysis.studentIndicators * 0.2)),
        classroomManagement: Math.min(5, 3 + (analysis.interactionCount * 0.1)),
        communicationSkills: Math.min(5, 2.5 + (analysis.wordCount > 200 ? 1 : 0) + (analysis.explanationCount * 0.3)),
        comments: [
          `Se identificaron ${analysis.explanationCount} explicaciones detalladas durante la sesión`,
          `La participación estudiantil registró ${analysis.questionCount} preguntas`,
          `El contenido cubrió ${analysis.topicsDiscussed.length} temas principales`,
          analysis.wordCount > 200 ? 'Contenido sustancial registrado' : 'Oportunidad de ampliar el contenido'
        ]
      };

      // Generar observación estructurada
      const structuredObservation = {
        planningAndPreparation: [
          analysis.topicsDiscussed.length > 2 ? 'Contenido bien estructurado con múltiples temas' : 'Estructura temática básica',
          analysis.explanationCount > 0 ? 'Explicaciones preparadas y coherentes' : 'Oportunidad de incluir más explicaciones'
        ],
        instructionalDelivery: [
          `Se registraron ${analysis.explanationCount} explicaciones durante la clase`,
          analysis.questionCount > 0 ? `${analysis.questionCount} preguntas facilitaron la comprensión` : 'Poca verificación de comprensión registrada',
          analysis.examplesUsed.length > 0 ? `Uso de ejemplos: ${analysis.examplesUsed.join(', ')}` : 'Oportunidad de incluir más ejemplos prácticos'
        ],
        classroomEnvironment: [
          analysis.studentIndicators > 0 ? 'Ambiente propicio para la participación estudiantil' : 'Ambiente principalmente expositivo',
          analysis.questionCount > 2 ? 'Alta interactividad registrada' : 'Oportunidad de aumentar la interactividad'
        ],
        professionalResponsibilities: [
          'Uso de tecnología para registro y análisis de la clase',
          analysis.wordCount > 100 ? 'Contenido académico sustancial' : 'Contenido básico registrado'
        ]
      };

      // Generar retroalimentación 360°
      const feedback360 = {
        selfEvaluation: [
          analysis.explanationCount > 2 ? 'Metodología explicativa efectiva implementada' : 'Oportunidad de enriquecer las explicaciones',
          analysis.topicsDiscussed.length > 1 ? 'Cobertura temática diversificada lograda' : 'Enfoque temático concentrado'
        ],
        studentPerspective: [
          analysis.questionCount > 0 ? `Los estudiantes formularon ${analysis.questionCount} preguntas, indicando engagement` : 'Poca participación estudiantil registrada',
          analysis.studentIndicators > 0 ? 'Indicadores de participación estudiantil detectados' : 'Oportunidad de estimular más participación'
        ],
        peerObservations: [
          analysis.professorIndicators > 2 ? 'Metodología docente estructurada observable' : 'Metodología básica registrada',
          analysis.contentAnalysis ? 'Uso de análisis de contenido para mejora continua' : 'Enfoque tradicional de enseñanza'
        ],
        improvementAreas: [
          analysis.questionCount < 2 ? 'Incrementar técnicas de verificación de comprensión' : 'Mantener el nivel de interactividad',
          analysis.examplesUsed.length === 0 ? 'Incorporar más ejemplos prácticos y casos de estudio' : 'Continuar con el uso efectivo de ejemplos'
        ]
      };

      // Generar portafolio docente
      const teachingPortfolio = {
        strengths: [
          analysis.explanationCount > 0 ? `Capacidad explicativa: ${analysis.explanationCount} explicaciones registradas` : 'Enfoque directo de enseñanza',
          analysis.topicsDiscussed.length > 1 ? `Cobertura temática amplia: ${analysis.topicsDiscussed.join(', ')}` : 'Enfoque temático específico',
          analysis.wordCount > 150 ? 'Riqueza de contenido verbal' : 'Comunicación concisa'
        ],
        innovativePractices: [
          'Implementación de análisis automatizado de clases',
          'Uso de transcripción para mejora pedagógica',
          analysis.contentAnalysis ? 'Análisis de frecuencia de palabras clave' : 'Enfoque tradicional'
        ],
        studentLearningEvidence: [
          analysis.questionCount > 0 ? `${analysis.questionCount} preguntas estudiantiles demuestran engagement` : 'Participación estudiantil limitada',
          analysis.studentIndicators > 0 ? 'Indicadores de participación activa registrados' : 'Formato principalmente expositivo'
        ],
        reflectiveInsights: [
          `La clase de ${formatTime(recordingTime)} generó ${analysis.wordCount} palabras de contenido`,
          analysis.mainWords.length > 0 ? `Términos clave identificados: ${analysis.mainWords.slice(0, 3).map(([word]) => word).join(', ')}` : 'Vocabulario académico estándar',
          'El análisis automático permite identificar patrones para mejora continua'
        ]
      };

      // Generar evaluación ECDF
      const ecdfScore = Math.min(4, 1 + (analysis.explanationCount * 0.3) + (analysis.questionCount * 0.2) + (analysis.topicsDiscussed.length * 0.2));
      
      const ecdfModel = {
        domainExpertise: analysis.topicsDiscussed.length > 1 ? 
          `Demuestra conocimiento sólido en ${analysis.topicsDiscussed.length} áreas temáticas: ${analysis.topicsDiscussed.join(', ')}` :
          'Conocimiento básico del área temática evidenciado',
        pedagogicalKnowledge: analysis.explanationCount > 1 ?
          `Aplicación efectiva de estrategias explicativas (${analysis.explanationCount} explicaciones registradas)` :
          'Metodología pedagógica básica implementada',
        contextualKnowledge: analysis.studentIndicators > 0 ?
          'Adaptación al contexto estudiantil evidenciada en las interacciones registradas' :
          'Oportunidad de mayor adaptación al contexto estudiantil',
        professionalDevelopment: 'Uso de herramientas tecnológicas para análisis y mejora de la práctica docente',
        score: ecdfScore
      };

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
        rubricEvaluation,
        structuredObservation,
        feedback360,
        teachingPortfolio,
        ecdfModel,
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
        description: `Evaluaciones generadas basadas en el contenido real de ${analysis.wordCount} palabras`,
      });
    }, 3000);
  };

  const resetAnalysis = () => {
    setClassAnalysis({
      summary: '',
      rubricEvaluation: {
        domainKnowledge: 0,
        teachingMethodology: 0,
        studentEngagement: 0,
        classroomManagement: 0,
        communicationSkills: 0,
        comments: []
      },
      structuredObservation: {
        planningAndPreparation: [],
        instructionalDelivery: [],
        classroomEnvironment: [],
        professionalResponsibilities: []
      },
      feedback360: {
        selfEvaluation: [],
        studentPerspective: [],
        peerObservations: [],
        improvementAreas: []
      },
      teachingPortfolio: {
        strengths: [],
        innovativePractices: [],
        studentLearningEvidence: [],
        reflectiveInsights: []
      },
      ecdfModel: {
        domainExpertise: '',
        pedagogicalKnowledge: '',
        contextualKnowledge: '',
        professionalDevelopment: '',
        score: 0
      },
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
