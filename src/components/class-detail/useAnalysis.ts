import { useState } from 'react';
import { ClassAnalysis } from '@/types/classAnalysis';
import { useToast } from '@/hooks/use-toast';
import { analysisService } from '@/services/analysisService';
import { AIAnalysis } from '@/types/api';

// Convert backend analysis format to frontend format
const convertBackendAnalysisToFrontend = (backendAnalysis: AIAnalysis): ClassAnalysis => {
  const analysisData = backendAnalysis.analysisData as any;
  
  return {
    transcript: analysisData.transcript || '',
    resumen: {
      tema: analysisData.summary?.title || 'Análisis de Clase',
      objetivos: analysisData.summary?.content || 'Objetivos de la clase',
      duracion: analysisData.summary?.duration || '45 minutos',
      participantes: {
        profesores: ['Profesor Principal'],
        estudiantes: Array.from({ length: analysisData.summary?.participants || 25 }, (_, i) => `Estudiante ${i + 1}`)
      }
    },
    structuredObservation: {
      planningAndPreparation: analysisData.keyConcepts?.map((concept: any) => ({
        criterion: concept.concept,
        evidence: concept.description,
        level: concept.importance === 'Alta' ? 'EXCELENTE' : 'BUENO'
      })) || [],
      instructionalDelivery: [],
      classroomEnvironment: [],
      professionalResponsibilities: []
    },
    criterios_evaluacion: {
      contexto_practica: {
        comprension_contexto: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        flexibilidad_practica: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        vinculacion_familias: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      },
      reflexion_planeacion: {
        propositos_claros: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        articulacion_contenidos: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        organizacion_conocimiento: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      },
      praxis_pedagogica: {
        comunicacion_docente_estudiantes: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        estrategias_participacion: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        interes_estudiantes: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      },
      ambiente_aula: {
        clima_respeto: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        toma_decisiones: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        estructura_organizacion: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      }
    },
    momentos_clave: analysisData.keyMoments?.map((moment: any) => ({
      timestamp: moment.timestamp,
      description: moment.description,
      importance: moment.importance,
      type: 'explicacion'
    })) || [],
    participacion_estudiantes: {
      nivel_participacion: analysisData.studentParticipation?.qualityScore > 8 ? 'Alto' : 'Medio',
      tipos_interaccion: ['Preguntas', 'Respuestas', 'Comentarios'],
      momentos_destacados: analysisData.keyMoments?.map((moment: any) => ({
        timestamp: moment.timestamp,
        description: moment.description
      })) || [],
      distribucion_participacion: {
        profesores: {
          tiempo_total: '30 minutos',
          intervenciones: 10
        },
        estudiantes: {
          tiempo_total: '15 minutos',
          intervenciones: analysisData.studentParticipation?.totalInterventions || 15
        }
      }
    },
    areas_mejora: {
      fortalezas: analysisData.evaluation?.strengths || [],
      oportunidades: analysisData.evaluation?.areasForImprovement || [],
      recomendaciones_generales: analysisData.suggestions || []
    },
    teachingPortfolio: {
      strengths: analysisData.evaluation?.strengths || [],
      innovativePractices: [],
      studentLearningEvidence: [],
      reflectiveInsights: []
    },
    feedback360: {
      selfEvaluation: [],
      studentPerspective: [],
      peerObservations: [],
      improvementAreas: analysisData.evaluation?.areasForImprovement || []
    },
    rubricEvaluation: {
      domainKnowledge: Math.round((analysisData.evaluation?.overallScore || 8.2) * 10),
      teachingMethodology: Math.round((analysisData.evaluation?.overallScore || 8.2) * 10),
      studentEngagement: Math.round((analysisData.studentParticipation?.qualityScore || 8.5) * 10),
      classroomManagement: Math.round((analysisData.evaluation?.overallScore || 8.2) * 10),
      communicationSkills: Math.round((analysisData.evaluation?.overallScore || 8.2) * 10),
      comments: analysisData.suggestions || []
    },
    voiceAnalysis: undefined,
    contentAnalysis: undefined
  };
};

export const useAnalysis = () => {
  const { toast } = useToast();
  
  const [classAnalysis, setClassAnalysis] = useState<ClassAnalysis>({
    transcript: '',
    resumen: {
      tema: '',
      objetivos: '',
      duracion: '',
      participantes: {
        profesores: [],
        estudiantes: []
      }
    },
    structuredObservation: {
      planningAndPreparation: [],
      instructionalDelivery: [],
      classroomEnvironment: [],
      professionalResponsibilities: []
    },
    criterios_evaluacion: {
      contexto_practica: {
        comprension_contexto: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        flexibilidad_practica: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        vinculacion_familias: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      },
      reflexion_planeacion: {
        propositos_claros: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        articulacion_contenidos: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        organizacion_conocimiento: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      },
      praxis_pedagogica: {
        comunicacion_docente_estudiantes: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        estrategias_participacion: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        interes_estudiantes: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      },
      ambiente_aula: {
        clima_respeto: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        toma_decisiones: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        },
        estructura_organizacion: {
          nivel: 'MÍNIMO',
          evidencias: [],
          recomendaciones: []
        }
      }
    },
    momentos_clave: [],
    participacion_estudiantes: {
      nivel_participacion: '',
      tipos_interaccion: [],
      momentos_destacados: [],
      distribucion_participacion: {
        profesores: {
          tiempo_total: '',
          intervenciones: 0
        },
        estudiantes: {
          tiempo_total: '',
          intervenciones: 0
        }
      }
    },
    areas_mejora: {
      fortalezas: [],
      oportunidades: [],
      recomendaciones_generales: []
    },
    teachingPortfolio: {
      strengths: [],
      innovativePractices: [],
      studentLearningEvidence: [],
      reflectiveInsights: []
    },
    feedback360: {
      selfEvaluation: [],
      studentPerspective: [],
      peerObservations: [],
      improvementAreas: []
    },
    rubricEvaluation: {
      domainKnowledge: 0,
      teachingMethodology: 0,
      studentEngagement: 0,
      classroomManagement: 0,
      communicationSkills: 0,
      comments: []
    },
    voiceAnalysis: undefined,
    contentAnalysis: undefined
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateAnalysis = async (transcript: string, classId?: string) => {
    if (!transcript.trim()) {
      toast({
        title: "Error",
        description: "La transcripción está vacía. Por favor, asegúrate de tener contenido para analizar.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting transcript analysis...');
      
      // Call the backend API to analyze transcript
      const response = await analysisService.analyzeTranscript({
        transcript,
        classId: classId || 'default-class'
      });
      
      console.log('Analysis API response:', response);
      
      // Get the analysis data
      const analysisData = await analysisService.getAnalysisById(response.data.analysisId);
      console.log('Analysis data retrieved:', analysisData);
      
      // Convert backend analysis to frontend format
      const convertedAnalysis = convertBackendAnalysisToFrontend(analysisData.data);
      setClassAnalysis(convertedAnalysis);
      
      toast({
        title: "Análisis Completado",
        description: "El análisis de la clase ha sido generado exitosamente.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error in generateAnalysis:', error);
      let errorMessage = "Hubo un error al generar el análisis.";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "No se pudo conectar con el servicio de análisis. Por favor, verifica tu conexión a internet e inténtalo de nuevo.";
        } else if (error.message.includes('API error')) {
          errorMessage = "Error en el servicio de análisis. Por favor, inténtalo de nuevo más tarde.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      toast({
        title: "Error en el Análisis",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setClassAnalysis({
      transcript: '',
      resumen: {
        tema: '',
        objetivos: '',
        duracion: '',
        participantes: {
          profesores: [],
          estudiantes: []
        }
      },
      structuredObservation: {
        planningAndPreparation: [],
        instructionalDelivery: [],
        classroomEnvironment: [],
        professionalResponsibilities: []
      },
      criterios_evaluacion: {
        contexto_practica: {
          comprension_contexto: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          flexibilidad_practica: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          vinculacion_familias: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          }
        },
        reflexion_planeacion: {
          propositos_claros: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          articulacion_contenidos: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          organizacion_conocimiento: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          }
        },
        praxis_pedagogica: {
          comunicacion_docente_estudiantes: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          estrategias_participacion: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          interes_estudiantes: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          }
        },
        ambiente_aula: {
          clima_respeto: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          toma_decisiones: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          },
          estructura_organizacion: {
            nivel: 'MÍNIMO',
            evidencias: [],
            recomendaciones: []
          }
        }
      },
      momentos_clave: [],
      participacion_estudiantes: {
        nivel_participacion: '',
        tipos_interaccion: [],
        momentos_destacados: [],
        distribucion_participacion: {
          profesores: {
            tiempo_total: '',
            intervenciones: 0
          },
          estudiantes: {
            tiempo_total: '',
            intervenciones: 0
          }
        }
      },
      areas_mejora: {
        fortalezas: [],
        oportunidades: [],
        recomendaciones_generales: []
      },
      teachingPortfolio: {
        strengths: [],
        innovativePractices: [],
        studentLearningEvidence: [],
        reflectiveInsights: []
      },
      feedback360: {
        selfEvaluation: [],
        studentPerspective: [],
        peerObservations: [],
        improvementAreas: []
      },
      rubricEvaluation: {
        domainKnowledge: 0,
        teachingMethodology: 0,
        studentEngagement: 0,
        classroomManagement: 0,
        communicationSkills: 0,
        comments: []
      },
      voiceAnalysis: undefined,
      contentAnalysis: undefined
    });
  };

  return {
    classAnalysis,
    isAnalyzing,
    generateAnalysis,
    resetAnalysis
  };
};
