export interface VoiceAnalysis {
  totalSpeakers: number;
  professorSpeechTime: number;
  studentSpeechTime: number;
  questionCount: number;
  interactionCount: number;
}

export interface ContentAnalysis {
  topicsDiscussed: string[];
  conceptsExplained: string[];
  examplesUsed: string[];
  keywordFrequency: { [key: string]: number };
}

export interface CriterioEvaluacion {
  nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
  evidencias: string[];
  recomendaciones: string[];
}

export interface ContextoPractica {
  comprension_contexto: CriterioEvaluacion;
  flexibilidad_practica: CriterioEvaluacion;
  vinculacion_familias: CriterioEvaluacion;
}

export interface ReflexionPlaneacion {
  propositos_claros: CriterioEvaluacion;
  articulacion_contenidos: CriterioEvaluacion;
  organizacion_conocimiento: CriterioEvaluacion;
}

export interface PraxisPedagogica {
  comunicacion_docente_estudiantes: CriterioEvaluacion;
  estrategias_participacion: CriterioEvaluacion;
  interes_estudiantes: CriterioEvaluacion;
}

export interface AmbienteAula {
  clima_respeto: CriterioEvaluacion;
  toma_decisiones: CriterioEvaluacion;
  estructura_organizacion: CriterioEvaluacion;
}

export interface CriteriosEvaluacion {
  contexto_practica: ContextoPractica;
  reflexion_planeacion: ReflexionPlaneacion;
  praxis_pedagogica: PraxisPedagogica;
  ambiente_aula: AmbienteAula;
}

export interface MomentoClave {
  tiempo: string;
  tipo: string;
  descripcion: string;
  impacto: string;
}

export interface ParticipacionEstudiantes {
  nivel_participacion: string;
  tipos_interaccion: string[];
  momentos_destacados: string[];
}

export interface AreasMejora {
  fortalezas: string[];
  oportunidades: string[];
  recomendaciones_generales: string[];
}

export interface Resumen {
  tema: string;
  objetivos: string;
  duracion: string;
  participantes: string;
}

export interface ClassAnalysis {
  transcript: string;
  resumen: {
    tema: string;
    objetivos: string;
    duracion: string;
    participantes: {
      profesores: string[];
      estudiantes: string[];
    };
  };
  structuredObservation: {
    planningAndPreparation: string[];
    instructionalDelivery: string[];
    classroomEnvironment: string[];
    professionalResponsibilities: string[];
  };
  criterios_evaluacion: {
    contexto_practica: {
      comprension_contexto: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      flexibilidad_practica: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      vinculacion_familias: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
    };
    reflexion_planeacion: {
      propositos_claros: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      articulacion_contenidos: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      organizacion_conocimiento: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
    };
    praxis_pedagogica: {
      comunicacion_docente_estudiantes: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      estrategias_participacion: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      interes_estudiantes: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
    };
    ambiente_aula: {
      clima_respeto: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      toma_decisiones: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
      estructura_organizacion: {
        nivel: 'AVANZADO' | 'SATISFACTORIO' | 'MÍNIMO' | 'INFERIOR';
        evidencias: string[];
        recomendaciones: string[];
      };
    };
  };
  momentos_clave: Array<{
    tiempo: string;
    tipo: string;
    descripcion: string;
    impacto: string;
    participante: string;
  }>;
  participacion_estudiantes: {
    nivel_participacion: string;
    tipos_interaccion: string[];
    momentos_destacados: string[];
    distribucion_participacion: {
      profesores: {
        tiempo_total: string;
        intervenciones: number;
      };
      estudiantes: {
        tiempo_total: string;
        intervenciones: number;
      };
    };
  };
  areas_mejora: {
    fortalezas: string[];
    oportunidades: string[];
    recomendaciones_generales: string[];
  };
  teachingPortfolio: {
    strengths: string[];
    innovativePractices: string[];
    studentLearningEvidence: string[];
    reflectiveInsights: string[];
  };
  feedback360: {
    selfEvaluation: string[];
    studentPerspective: string[];
    peerObservations: string[];
    improvementAreas: string[];
  };
  rubricEvaluation: {
    domainKnowledge: number;
    teachingMethodology: number;
    studentEngagement: number;
    classroomManagement: number;
    communicationSkills: number;
    comments: string[];
  };
  voiceAnalysis?: VoiceAnalysis;
  contentAnalysis?: ContentAnalysis;
}

export interface ClassData {
  id: string | undefined;
  name: string;
  teacher: string;
  day: string;
  time: string;
  description: string;
  subject: string;
  duration: number;
}
