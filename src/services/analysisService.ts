import { RAGService } from './ragService';

interface AnalysisRequest {
  audioUrl: string;
  ragId: string;
  straicoToken: string;
  model?: string;
  searchOptions?: {
    search_type?: 'similarity' | 'mmr' | 'similarity_score_threshold';
    k?: number;
    fetch_k?: number;
    lambda_mult?: number;
    score_threshold?: number;
  };
}

interface AnalysisResponse {
  success: boolean;
  data: {
    transcript: string;
    analysis: string;
    references: Array<{
      page_content: string;
      page: number;
    }>;
    coins_used: number;
  };
}

export class AnalysisService {
  private ragService: RAGService;

  constructor(straicoToken: string, ragId: string) {
    this.ragService = new RAGService(straicoToken, ragId);
  }

  async analyzeClass(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      // 1. Obtener la transcripción del audio
      const transcript = await this.getTranscript(request.audioUrl);

      // 2. Crear un prompt que incluya la transcripción y solicite un análisis
      const prompt = `Analiza la siguiente transcripción de una clase y proporciona un análisis detallado. 
      Considera el contexto de los materiales del curso y proporciona referencias específicas cuando sea relevante.
      
      Transcripción:
      ${transcript}
      
      Por favor, proporciona:
      1. Un resumen de los puntos principales
      2. Conceptos clave discutidos
      3. Ejemplos o casos mencionados
      4. Preguntas o áreas que podrían necesitar más clarificación
      5. Conexiones con otros temas del curso`;

      // 3. Usar RAG para obtener un análisis enriquecido
      const ragResponse = await this.ragService.promptCompletion(
        prompt,
        request.model || 'anthropic/claude-3.5-sonnet',
        request.searchOptions
      );

      return {
        success: true,
        data: {
          transcript,
          analysis: ragResponse.data.answer,
          references: ragResponse.data.references,
          coins_used: ragResponse.data.coins_used
        }
      };
    } catch (error) {
      console.error('Error en el análisis:', error);
      throw new Error('Error al analizar la clase');
    }
  }

  private async getTranscript(audioUrl: string): Promise<string> {
    // Aquí iría la lógica para obtener la transcripción del audio
    // Por ahora retornamos un texto de ejemplo
    return "Esta es una transcripción de ejemplo de la clase...";
  }
} 