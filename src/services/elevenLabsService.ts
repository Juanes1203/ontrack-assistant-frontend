import axios from 'axios';

// Use the new API key
const ELEVENLABS_API_KEY = 'sk_a0292539a8df6c0104b3a9b0baa2b2a009ec9a4bec33efb7';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/convai';
const ELEVENLABS_AGENT_ID = 'agent_01jxkjj751fsktj1ekm63k0pkd';

interface TextToSpeechResponse {
  audio: string;
  error?: string;
}

interface KnowledgeBaseResponse {
  success: boolean;
  error?: string;
  id?: string;
  name?: string;
}

export const elevenLabsService = {
  async textToSpeech(text: string, voiceId: string = '21m00Tcm4TlvDq8ikWAM'): Promise<TextToSpeechResponse> {
    try {
      const response = await axios({
        method: 'POST',
        url: `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        data: {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        },
        responseType: 'arraybuffer'
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      return { audio: audioUrl };
    } catch (error) {
      console.error('Error converting text to speech:', error);
      return { 
        audio: '',
        error: 'Error al convertir el texto a voz. Por favor, verifica tu API key de ElevenLabs.'
      };
    }
  },

  async getVoices() {
    try {
      const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      });
      return response.data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  },

  async createKnowledgeBase(text: string): Promise<KnowledgeBaseResponse> {
    try {
      // First, create a text file from the content
      const blob = new Blob([text], { type: 'text/plain' });
      const file = new File([blob], 'transcript.txt', { type: 'text/plain' });

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `Análisis de Clase - ${new Date().toLocaleDateString()}`);

      console.log('Sending file to ElevenLabs:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        name: formData.get('name')
      });

      // Create the knowledge base document using the file endpoint
      const response = await axios({
        method: 'POST',
        url: `${ELEVENLABS_API_URL}/knowledge-base/file`,
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        },
        data: formData
      });

      console.log('ElevenLabs response:', response.data);

      // After creating the document, trigger RAG indexing
      if (response.data.id) {
        try {
          await this.computeRagIndex(response.data.id);
        } catch (ragError) {
          console.warn('RAG indexing failed, but document was created:', ragError);
          // We don't want to fail the whole operation if RAG indexing fails
          return { 
            success: true,
            id: response.data.id,
            name: response.data.name,
            error: 'Documento creado pero el índice RAG no pudo ser generado. Puedes intentar indexarlo más tarde.'
          };
        }
      }

      return { 
        success: true,
        id: response.data.id,
        name: response.data.name
      };
    } catch (error: any) {
      // Enhanced error logging
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });

      let errorMessage = 'Error al enviar el análisis a ElevenLabs. ';
      
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage += error.response.data.detail.join(', ');
        } else {
          errorMessage += error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Por favor, verifica tu API key.';
      }

      return { 
        success: false,
        error: errorMessage
      };
    }
  },

  async computeRagIndex(documentId: string): Promise<void> {
    try {
      const response = await axios({
        method: 'POST',
        url: `${ELEVENLABS_API_URL}/knowledge-base/${documentId}/rag-index`,
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        data: {
          model: 'multilingual_e5_large_instruct'
        }
      });
      console.log('RAG indexing response:', response.data);
    } catch (error: any) {
      console.error('Error computing RAG index:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }
}; 