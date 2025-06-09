import axios from 'axios';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/convai';
const ELEVENLABS_AGENT_ID = 'agent_01jwsqvdyeeqkv6jvmrwnw7z2g';

interface TextToSpeechResponse {
  audio: string;
  error?: string;
}

interface KnowledgeBaseResponse {
  success: boolean;
  error?: string;
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
      // Enviar el texto a la base de conocimiento del agente
      const response = await axios({
        method: 'POST',
        url: `${ELEVENLABS_API_URL}/knowledge-base/text`,
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        data: {
          text,
          name: `Análisis de Clase - ${new Date().toLocaleDateString()}`,
          agent_id: ELEVENLABS_AGENT_ID
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      return { 
        success: false,
        error: 'Error al enviar el análisis a ElevenLabs. Por favor, verifica tu API key.'
      };
    }
  }
}; 