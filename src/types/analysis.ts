export interface ClassAnalysis {
  id?: string;
  transcript: string;
  summary: string;
  key_points: string[];
  topics: string[];
  objectives: string[];
  methodology: string[];
  evaluation: string[];
  recommendations: string[];
  participacion_estudiantes?: {
    nivel_participacion?: string;
    tipos_interaccion?: string[];
    momentos_destacados?: string[];
  };
  momentos_clave?: {
    descripcion: string;
    timestamp: string;
  }[];
  criterios_ecdf?: {
    criterio: string;
    cumplimiento: string;
    observaciones: string;
  }[];
} 