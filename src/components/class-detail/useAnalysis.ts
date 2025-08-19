import { useState } from 'react';
import { ClassAnalysis } from '@/types/classAnalysis';
import { useToast } from '@/hooks/use-toast';
import { analyzeTranscript } from '@/services/straicoService';
import { classService } from '@/services/classService';

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
      const analysis = await analyzeTranscript(transcript);
      console.log('Analysis completed successfully');
      setClassAnalysis(analysis);
      
      // Guardar automáticamente el análisis si se proporciona classId
      if (classId) {
        try {
          await classService.updateAnalysisData(classId, analysis);
          toast({
            title: "Análisis Completado y Guardado",
            description: "El análisis se ha generado y guardado correctamente en la base de datos.",
            variant: "default"
          });
        } catch (saveError) {
          console.error('Error saving analysis:', saveError);
          toast({
            title: "Análisis Generado",
            description: "El análisis se generó pero no se pudo guardar automáticamente. Usa el botón 'Guardar' para guardarlo manualmente.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Análisis Completado",
          description: "El análisis de la clase ha sido generado exitosamente.",
          variant: "default"
        });
      }
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
    resetAnalysis,
    setClassAnalysis
  };
};
