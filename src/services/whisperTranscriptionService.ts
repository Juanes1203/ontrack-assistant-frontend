/**
 * Whisper Transcription Service
 * 
 * Uses MediaRecorder API to capture audio and sends the complete recording
 * to backend for transcription using OpenAI Whisper. This avoids the limitations
 * of Web Speech API and chunk-based transcription issues.
 */

export interface LiveTranscriptionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export class WhisperTranscriptionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private isRecording = false;
  private onTranscript: ((result: LiveTranscriptionResult) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private fullTranscript = '';
  private recordingId: string | null = null;
  private classId: string | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartTime: number = 0;

  /**
   * Start recording (accumulates audio, no chunks sent)
   */
  async startRecording(
    recordingId: string,
    classId: string,
    onTranscript: (result: LiveTranscriptionResult) => void,
    onError: (error: string) => void
  ) {
    if (this.isRecording) {
      throw new Error('Already recording');
    }

    this.recordingId = recordingId;
    this.classId = classId;
    this.onTranscript = onTranscript;
    this.onError = onError;
    this.fullTranscript = '';
    this.audioChunks = [];
    this.recordingStartTime = Date.now();

    try {
      // Request microphone access
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso al micrófono. Por favor usa Chrome, Firefox o Edge.');
      }

      // List available devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        if (audioDevices.length === 0) {
          throw new Error('No se encontró ningún micrófono conectado. Por favor conecta un micrófono y recarga la página.');
        }
      } catch (enumError) {
        console.warn('No se pudieron enumerar dispositivos:', enumError);
      }

      // Get audio stream
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Whisper works best with 16kHz
        }
      });

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported('audio/webm') && !MediaRecorder.isTypeSupported('audio/mp4')) {
        throw new Error('Tu navegador no soporta grabación de audio. Por favor usa Chrome, Firefox o Edge.');
      }

      // Determine best MIME type - prefer webm for better compatibility
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType,
        audioBitsPerSecond: 128000 // 128 kbps - good quality for speech
      });

      // Handle data available - accumulate all chunks
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        if (this.onError) {
          this.onError('Error en la grabación de audio');
        }
      };

      // Start recording - collect data every 1 second
      this.mediaRecorder.start(1000);
      this.isRecording = true;

      console.log(`[${new Date().toLocaleTimeString()}] ✅ Grabación iniciada con Whisper - Se enviará completa al finalizar (sin límite de tiempo)`);

    } catch (error: any) {
      console.error('Error starting recording:', error);
      
      // Clean up on error
      this.stopRecording();
      
      // Provide specific error messages
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        throw new Error('No se encontró ningún micrófono. Por favor conecta un micrófono y recarga la página.');
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        throw new Error('Acceso al micrófono denegado. Por favor permite el acceso al micrófono en la configuración del navegador y recarga la página.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        throw new Error('El micrófono está siendo usado por otra aplicación. Por favor cierra otras aplicaciones que usen el micrófono e intenta de nuevo.');
      } else if (error.message) {
        throw new Error(`Error al acceder al micrófono: ${error.message}`);
      } else {
        throw new Error('Error al acceder al micrófono. Por favor verifica que tengas un micrófono conectado y que el navegador tenga permisos para usarlo.');
      }
    }
  }

  /**
   * Stop recording and send complete audio file for transcription
   */
  async stopRecording(): Promise<{ transcript: string; duration: number } | null> {
    if (!this.isRecording) {
      return null;
    }

    const duration = Math.floor((Date.now() - this.recordingStartTime) / 1000);

    try {
      // Stop MediaRecorder
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        
        // Wait for final data
        await new Promise<void>((resolve) => {
          if (this.mediaRecorder) {
            this.mediaRecorder.onstop = () => resolve();
            // Timeout after 2 seconds if stop event doesn't fire
            setTimeout(() => resolve(), 2000);
          } else {
            resolve();
          }
        });
      }

      // Stop all tracks
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => track.stop());
        this.audioStream = null;
      }

      this.mediaRecorder = null;
      this.isRecording = false;

      // If we have audio chunks, send them for transcription
      if (this.audioChunks.length > 0 && this.classId) {
        // Combine all chunks into a single blob
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        
        console.log(`[${new Date().toLocaleTimeString()}] 📤 Enviando grabación completa (${(audioBlob.size / 1024 / 1024).toFixed(2)} MB, ${duration}s) para transcripción...`);

        // Create FormData
        const formData = new FormData();
        formData.append('recording', audioBlob, `recording-${Date.now()}.${mimeType.includes('webm') ? 'webm' : 'mp4'}`);
        formData.append('classId', this.classId);

        // Get auth token (usar 'auth_token' que es el nombre usado en el resto de la app)
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        // Send to backend for transcription
        const response = await fetch(`/api/recordings/upload-transcribe`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          const recording = data.data.recording;
          
          // The transcript will be processed in the background
          // We return the recording ID and duration
          console.log(`[${new Date().toLocaleTimeString()}] ✅ Grabación enviada correctamente. ID: ${recording.id}`);
          
          // Clear chunks
          this.audioChunks = [];
          
          return {
            transcript: '', // Will be populated by backend
            duration
          };
        }
      }

      // Clear chunks
      this.audioChunks = [];
      
      return {
        transcript: '',
        duration
      };

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error enviando grabación:`, error);
      
      if (this.onError && error.message) {
        this.onError(`Error al enviar grabación: ${error.message}`);
      }
      
      // Clear chunks even on error
      this.audioChunks = [];
      
      return {
        transcript: '',
        duration
      };
    }
  }

  /**
   * Get full accumulated transcript (empty during recording, populated after)
   */
  getFullTranscript(): string {
    return this.fullTranscript;
  }

  /**
   * Check if currently recording
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.fullTranscript = '';
    this.onTranscript = null;
    this.onError = null;
    this.recordingId = null;
    this.classId = null;
    this.audioChunks = [];
    this.recordingStartTime = 0;
  }
}

export const whisperTranscriptionService = new WhisperTranscriptionService();

