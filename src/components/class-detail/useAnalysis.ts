import { useState } from 'react';
import { ClassAnalysis, ClassObjective } from '@/types/classAnalysis';
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
    },
    classObjective: {
      mainObjective: '',
      specificObjectives: [],
      achievementStatus: 'not_achieved',
      evidence: [],
      recommendations: []
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeTranscriptContent = (text: string) => {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Análisis básico de contenido
    const analysis = {
      wordCount,
      mainWords: [] as [string, number][],
      topicsDiscussed: [] as string[],
      examplesUsed: [] as string[],
      keywordFrequency: {} as Record<string, number>,
      explanationCount: 0,
      questionCount: 0,
      professorIndicators: 0,
      studentIndicators: 0
    };

    // Detectar preguntas
    const questionPatterns = [
      /\?/g,
      /\b(qué|quien|cuando|donde|por qué|como|cual|cuanto|cuantos|cuantas)\b/gi,
      /\b(explique|describe|define|analiza|compara|contrasta|evalúa|justifica)\b/gi
    ];
    
    questionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        analysis.questionCount += matches.length;
      }
    });

    // Detectar explicaciones
    const explanationPatterns = [
      /\b(porque|debido a|ya que|puesto que|dado que)\b/gi,
      /\b(es decir|en otras palabras|esto significa que|lo que implica)\b/gi,
      /\b(por ejemplo|como ejemplo|un caso|una instancia)\b/gi
    ];
    
    explanationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        analysis.explanationCount += matches.length;
      }
    });

    // Detectar indicadores de profesor
    const professorPatterns = [
      /\b(clase|lección|tema|objetivo|aprendizaje)\b/gi,
      /\b(estudiantes|alumnos|compañeros)\b/gi,
      /\b(entender|comprender|aprender|analizar|evaluar)\b/gi
    ];
    
    professorPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        analysis.professorIndicators += matches.length;
      }
    });

    // Detectar indicadores de estudiante
    const studentPatterns = [
      /\b(pregunta|duda|entendí|comprendí|aprendí)\b/gi,
      /\b(no entiendo|no comprendo|no sé|confuso)\b/gi,
      /\b(interesante|importante|relevante|útil)\b/gi
    ];
    
    studentPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        analysis.studentIndicators += matches.length;
      }
    });

    // Análisis de frecuencia de palabras
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 3) { // Ignorar palabras muy cortas
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // Ordenar palabras por frecuencia
    analysis.mainWords = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Detectar temas basados en palabras clave frecuentes
    const topicKeywords = {
      'matemáticas': ['número', 'cálculo', 'ecuación', 'álgebra', 'geometría'],
      'ciencias': ['experimento', 'investigación', 'método', 'hipótesis', 'teoría'],
      'lenguaje': ['texto', 'lectura', 'escritura', 'gramática', 'vocabulario'],
      'historia': ['histórico', 'pasado', 'evento', 'periodo', 'civilización'],
      'tecnología': ['digital', 'computadora', 'software', 'hardware', 'programación']
    };

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      const topicMatches = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      if (topicMatches.length > 0) {
        analysis.topicsDiscussed.push(topic);
      }
    });

    // Si no se detectaron temas, usar las palabras más frecuentes
    if (analysis.topicsDiscussed.length === 0 && analysis.mainWords.length > 0) {
      analysis.topicsDiscussed = analysis.mainWords
        .slice(0, 3)
        .map(([word]) => word);
    }

    // Detectar ejemplos
    const examplePatterns = [
      /\b(por ejemplo|como ejemplo|un caso|una instancia)\b/gi,
      /\b(imaginemos|supongamos|consideremos)\b/gi
    ];
    
    examplePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        analysis.examplesUsed.push(...matches);
      }
    });

    // Si no se detectaron ejemplos, usar algunas palabras clave como ejemplos
    if (analysis.examplesUsed.length === 0 && analysis.mainWords.length > 0) {
      analysis.examplesUsed = analysis.mainWords
        .slice(0, 2)
        .map(([word]) => `Ejemplo de ${word}`);
    }

    analysis.keywordFrequency = wordFrequency;
    return analysis;
  };

  const generateContentBasedSummary = (text: string, analysis: any, recordingTime: number, formatTime: (seconds: number) => string) => {
    if (!text.trim() || analysis.wordCount < 5) {
      return "No se detectó contenido suficiente en la transcripción para generar un resumen detallado. Asegúrese de que la grabación capture audio claro y que haya contenido hablado durante la sesión.";
    }

    // Extraer el título o tema principal
    const firstLine = text.split('\n')[0].trim();
    const title = firstLine.includes('–') ? firstLine.split('–')[0].trim() : firstLine;

    // Identificar participantes
    const participants = [];
    const participantPattern = /(?:Prof\.|Estudiante)\s+[^:]+/g;
    const matches = text.match(participantPattern) || [];
    matches.forEach(match => {
      if (!participants.includes(match)) {
        participants.push(match);
      }
    });

    // Generar resumen estructurado
    let summary = `RESUMEN EJECUTIVO\n\n`;
    summary += `${title}\n`;
    summary += `Duración: ${formatTime(recordingTime)} | Contenido: ${analysis.wordCount} palabras\n\n`;

    // Información de participantes
    if (participants.length > 0) {
      summary += `PARTICIPANTES:\n`;
      participants.forEach(participant => {
        summary += `  • ${participant}\n`;
      });
      summary += '\n';
    }

    // Temas principales
    if (analysis.topicsDiscussed.length > 0) {
      summary += `TEMAS PRINCIPALES:\n`;
      analysis.topicsDiscussed.forEach((topic: string) => {
        summary += `  • ${topic}\n`;
      });
      summary += '\n';
    }

    // Puntos clave de la discusión
    const explanationPattern = /\b(es decir|por ejemplo|como|significa|definimos|concepto de|teoría de)\b.*?[.!?]/gi;
    const explanations = text.match(explanationPattern) || [];
    if (explanations.length > 0) {
      summary += `PUNTOS CLAVE:\n`;
      explanations.slice(0, 3).forEach((exp: string) => {
        summary += `  • ${exp.trim()}\n`;
      });
      summary += '\n';
    }

    // Interacciones significativas
    if (analysis.questionCount > 0) {
      summary += `PREGUNTAS DESTACADAS:\n`;
      // Extraer preguntas del texto
      const questionPattern = /[^.!?]*\?/g;
      const questions = text.match(questionPattern) || [];
      questions.slice(0, 2).forEach((question: string) => {
        summary += `  • "${question.trim()}"\n`;
      });
      summary += '\n';
    }

    // Métricas y participación
    summary += `MÉTRICAS DE LA SESIÓN:\n`;
    if (analysis.examplesUsed.length > 0) {
      summary += `  • Estrategias didácticas: ${analysis.examplesUsed.join(', ')}\n`;
    }
    if (analysis.explanationCount > 0) {
      summary += `  • Explicaciones realizadas: ${analysis.explanationCount}\n`;
    }
    const totalIndicators = analysis.professorIndicators + analysis.studentIndicators;
    if (totalIndicators > 0) {
      const professorPercentage = Math.round((analysis.professorIndicators / totalIndicators) * 100);
      summary += `  • Distribución de participación: ${professorPercentage}% docente / ${100 - professorPercentage}% estudiantil\n`;
      if (analysis.questionCount > 0) {
        summary += `  • Preguntas formuladas: ${analysis.questionCount}\n`;
      }
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

    try {
      const analysis = analyzeTranscriptContent(transcript);
      const summary = generateContentBasedSummary(transcript, analysis, recordingTime, formatTime);

      // Generar evaluación por rúbricas basada en el análisis
      const rubricEvaluation = {
        domainKnowledge: Math.min(5, 2 + (analysis.explanationCount * 0.5) + (analysis.topicsDiscussed.length * 0.3)),
        teachingMethodology: Math.min(5, 2 + (analysis.professorIndicators * 0.1) + (analysis.explanationCount * 0.4)),
        studentEngagement: Math.min(5, 1 + (analysis.questionCount * 0.3) + (analysis.studentIndicators * 0.2)),
        classroomManagement: Math.min(5, 3 + ((analysis.professorIndicators + analysis.studentIndicators) * 0.1)),
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
          analysis.topicsDiscussed.length > 0 ? 'Uso de análisis de contenido para mejora continua' : 'Enfoque tradicional de enseñanza'
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
          analysis.topicsDiscussed.length > 0 ? 'Análisis de frecuencia de palabras clave' : 'Enfoque tradicional'
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

      // Generar análisis de participación estudiantil
      const studentParticipation = analysis.studentIndicators > 0
        ? `Se detectaron ${analysis.studentIndicators} indicadores de participación estudiantil en la transcripción. ${
            analysis.questionCount > 0
              ? `Los estudiantes formularon ${analysis.questionCount} preguntas durante la sesión, ${
                  analysis.studentIndicators >= 3
                    ? 'demostrando un ambiente de aprendizaje interactivo donde los estudiantes se sienten cómodos participando.'
                    : 'sugiriendo oportunidades para fomentar mayor participación activa.'
                }`
              : 'No se registraron preguntas por parte de los estudiantes, indicando la necesidad de implementar estrategias más dinámicas para estimular el engagement estudiantil.'
          }`
        : 'La transcripción no muestra indicadores claros de participación estudiantil directa. Se recomienda implementar estrategias para fomentar la participación activa.';

      // Generar análisis de desempeño del profesor
      const professorPerformance = analysis.professorIndicators > 0
        ? `Se identificaron ${analysis.professorIndicators} indicadores de instrucción estructurada en la transcripción. ${
            analysis.explanationCount > 0
              ? `El profesor proporcionó ${analysis.explanationCount} explicaciones detalladas, ${
                  analysis.topicsDiscussed.length > 0
                    ? `cubriendo ${analysis.topicsDiscussed.length} temas principales: ${analysis.topicsDiscussed.join(', ')}. `
                    : 'con cobertura temática limitada detectada. '
                }`
              : 'No se registraron explicaciones detalladas en la transcripción, con cobertura temática limitada detectada. '
          }${
            analysis.professorIndicators >= 3 && analysis.explanationCount >= 2
              ? 'Esto indica un desempeño docente sólido con metodología clara y contenido bien estructurado.'
              : 'Hay oportunidades para enriquecer la metodología de enseñanza y aumentar la claridad en las explicaciones.'
          }`
        : 'El análisis no detectó indicadores claros de metodología docente estructurada. Se recomienda implementar estrategias más claras de enseñanza.';

      // Generar objetivos basados en el contenido
      const classObjective = {
        mainObjective: analysis.topicsDiscussed.length > 0 
          ? `Comprender los conceptos fundamentales de ${analysis.topicsDiscussed[0]}`
          : 'Desarrollar comprensión de los temas principales de la clase',
        specificObjectives: [
          ...analysis.topicsDiscussed.map(topic => `Entender los conceptos clave de ${topic}`),
          analysis.explanationCount > 0 ? 'Aplicar los conceptos explicados en ejercicios prácticos' : 'Identificar los puntos principales de la explicación',
          analysis.questionCount > 0 ? 'Participar activamente en la discusión de conceptos' : 'Desarrollar preguntas sobre los temas tratados'
        ],
        achievementStatus: analysis.explanationCount > 2 && analysis.questionCount > 1 
          ? 'achieved' as const
          : analysis.explanationCount > 0 
            ? 'partially_achieved' as const
            : 'not_achieved' as const,
        evidence: [
          analysis.explanationCount > 0 ? `${analysis.explanationCount} explicaciones detalladas de conceptos` : 'Explicaciones básicas de conceptos',
          analysis.questionCount > 0 ? `${analysis.questionCount} preguntas y respuestas durante la clase` : 'Interacción limitada durante la clase',
          analysis.topicsDiscussed.length > 0 ? `Cobertura de ${analysis.topicsDiscussed.length} temas principales` : 'Cobertura básica de temas'
        ],
        recommendations: [
          analysis.explanationCount < 2 ? 'Incluir más explicaciones detalladas de conceptos clave' : 'Mantener el nivel de explicación detallada',
          analysis.questionCount < 2 ? 'Fomentar más preguntas y participación de los estudiantes' : 'Continuar promoviendo la participación activa',
          analysis.topicsDiscussed.length < 2 ? 'Ampliar la cobertura de temas relacionados' : 'Mantener la profundidad en los temas tratados'
        ]
      };

      // Actualizar el estado con todos los análisis
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
        },
        classObjective
      });

      toast({
        title: "Análisis completado",
        description: `Evaluaciones generadas basadas en el contenido real de ${analysis.wordCount} palabras`,
      });
    } catch (error) {
      console.error('Error al generar el análisis:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al generar el análisis. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
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
      },
      classObjective: {
        mainObjective: '',
        specificObjectives: [],
        achievementStatus: 'not_achieved',
        evidence: [],
        recommendations: []
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
