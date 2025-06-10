import axios from 'axios';

const isDevelopment = import.meta.env.DEV;
const STRAICO_API_URL = isDevelopment 
  ? '/api/straico/v0/rag'
  : 'https://api.straico.com/v0/rag';

// Configuración global de axios
axios.interceptors.request.use(
  (config) => {
    // Asegurarse de que los headers estén correctamente configurados
    if (config.headers) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Error en la petición');
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error request:', error.request);
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error message:', error.message);
      throw new Error('Error al configurar la petición');
    }
  }
);

export interface RAGConfig {
  chunking_method?: 'fixed_size' | 'recursive' | 'markdown' | 'python' | 'semantic';
  chunk_size?: number;
  chunk_overlap?: number;
  buffer_size?: number;
  breakpoint_threshold_type?: 'percentile' | 'interquartile' | 'standard_deviation' | 'gradient';
  separator?: string;
  separators?: string[];
}

export interface RAGResponse {
  success: boolean;
  data: {
    answer: string;
    references: Array<{
      page_content: string;
      page: number;
    }>;
    file_name: string;
    coins_used: number;
  };
}

export interface CreateRAGResponse {
  success: boolean;
  data: {
    user_id: string;
    name: string;
    rag_url: string;
    original_filename: string;
    chunking_method: string;
    chunk_size: number;
    chunk_overlap: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  total_coins: number;
  total_words: number;
}

export class RAGService {
  private token: string;
  private ragId: string;

  constructor(token: string, ragId?: string) {
    this.token = token;
    this.ragId = ragId || '';
  }

  async createRAG(
    name: string,
    description: string,
    files: File[],
    config?: RAGConfig
  ): Promise<CreateRAGResponse> {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      
      // Añadir archivos (máximo 4)
      files.slice(0, 4).forEach(file => {
        formData.append('files', file);
      });

      // Añadir configuración opcional
      if (config) {
        Object.entries(config).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });
      }

      const response = await axios.post<CreateRAGResponse>(
        STRAICO_API_URL,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        this.ragId = response.data.data._id;
        return response.data;
      } else {
        throw new Error('Failed to create RAG');
      }
    } catch (error) {
      console.error('Error creating RAG:', error);
      throw new Error('Failed to create RAG');
    }
  }

  async updateRAG(files: File[], config?: RAGConfig): Promise<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    if (config) {
      Object.entries(config).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
    }

    const response = await axios.put(`${STRAICO_API_URL}/${this.ragId}`, formData, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async promptCompletion(
    prompt: string,
    model: string = 'anthropic/claude-3.5-sonnet',
    options?: {
      search_type?: 'similarity' | 'mmr' | 'similarity_score_threshold';
      k?: number;
      fetch_k?: number;
      lambda_mult?: number;
      score_threshold?: number;
    }
  ): Promise<RAGResponse> {
    const formData = new URLSearchParams();
    formData.append('prompt', prompt);
    formData.append('model', model);

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
    }

    const response = await axios.post(
      `${STRAICO_API_URL}/${this.ragId}/prompt`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  }

  async deleteRAG(): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${STRAICO_API_URL}/${this.ragId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    return response.data;
  }
} 