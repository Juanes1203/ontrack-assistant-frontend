export interface LiveTranscriptionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export class LiveTranscriptionService {
  private recognition: any = null;
  private isRecording = false;
  private onTranscript: ((result: LiveTranscriptionResult) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private fullTranscript = '';
  private restartInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';
    this.recognition.maxAlternatives = 1;
    this.recognition.serviceURI = undefined; // Use default service

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = this.fullTranscript + finalTranscript + interimTranscript;
      
      if (this.onTranscript) {
        this.onTranscript({
          transcript: currentTranscript,
          isFinal: finalTranscript.length > 0,
          confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0
        });
      }

      if (finalTranscript) {
        this.fullTranscript += finalTranscript;
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors
      if (event.error === 'no-speech') {
        console.log('No speech detected, continuing to listen...');
        // Don't call onError for no-speech, just continue
        return;
      }
      
      if (event.error === 'audio-capture') {
        console.error('Microphone access denied or not available');
        if (this.onError) {
          this.onError('Microphone access denied. Please check your microphone permissions.');
        }
        return;
      }
      
      if (event.error === 'not-allowed') {
        console.error('Microphone permission denied');
        if (this.onError) {
          this.onError('Microphone permission denied. Please allow microphone access.');
        }
        return;
      }
      
      // Manejar error de red con reconexión automática
      if (event.error === 'network') {
        console.warn('Network error detected, attempting to reconnect...');
        
        // Si está grabando, intentar reconectar automáticamente
        if (this.isRecording) {
          setTimeout(() => {
            try {
              // Detener el reconocimiento actual
              this.recognition.stop();
              
              // Reiniciar después de un breve delay
              setTimeout(() => {
                try {
                  this.recognition.start();
                  console.log('Successfully reconnected after network error');
                } catch (restartError) {
                  console.error('Error restarting recognition after network error:', restartError);
                  // Si falla, intentar reinicializar completamente
                  this.initializeRecognition();
                  if (this.isRecording) {
                    setTimeout(() => {
                      try {
                        this.recognition.start();
                        console.log('Reinitialized and restarted recognition after network error');
                      } catch (finalError) {
                        console.error('Failed to restart after reinitialization:', finalError);
                        this.isRecording = false;
                        if (this.onError) {
                          this.onError('Failed to reconnect after network error. Please restart recording manually.');
                        }
                      }
                    }, 500);
                  }
                }
              }, 500);
            } catch (error) {
              console.error('Error handling network error:', error);
              this.isRecording = false;
              if (this.onError) {
                this.onError('Network error occurred. Please restart recording.');
              }
            }
          }, 1000); // Esperar 1 segundo antes de intentar reconectar
        } else {
          // Si no está grabando, solo reportar el error
          if (this.onError) {
            this.onError('Network error occurred.');
          }
        }
        return;
      }
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      // Si estaba grabando y se detuvo inesperadamente (no por stopRecording), intentar reiniciar
      if (this.isRecording) {
        console.log('Recognition ended unexpectedly, attempting to restart...');
        setTimeout(() => {
          try {
            this.recognition.start();
            console.log('Successfully restarted recognition after unexpected end');
          } catch (error) {
            console.error('Error restarting recognition after unexpected end:', error);
            this.isRecording = false;
            if (this.onError) {
              this.onError('Recording stopped unexpectedly. Please restart manually.');
            }
          }
        }, 500);
      } else {
        this.isRecording = false;
      }
    };
  }

  async startRecording(
    onTranscript: (result: LiveTranscriptionResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isRecording) {
      throw new Error('Already recording');
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      console.log('Microphone permission granted');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Microphone access denied. Please allow microphone access and try again.');
    }

    this.onTranscript = onTranscript;
    this.onError = onError;
    this.fullTranscript = '';

    try {
      this.recognition.start();
      this.isRecording = true;
      console.log('Live transcription started successfully');
      
      // Iniciar reinicio proactivo cada 4 minutos (240000ms) para evitar error de red
      this.restartInterval = setInterval(() => {
        if (this.isRecording && this.recognition) {
          console.log('Proactive restart: Reiniciando reconocimiento antes del timeout de 5 minutos');
          try {
            this.recognition.stop();
            setTimeout(() => {
              try {
                this.recognition.start();
                console.log('Proactive restart: Reconocimiento reiniciado exitosamente');
              } catch (restartError) {
                console.error('Error en reinicio proactivo:', restartError);
                // Si falla, intentar reinicializar
                this.initializeRecognition();
                if (this.isRecording) {
                  setTimeout(() => {
                    try {
                      this.recognition.start();
                      console.log('Reinitialized and restarted after proactive restart failure');
                    } catch (finalError) {
                      console.error('Failed to restart after reinitialization:', finalError);
                    }
                  }, 500);
                }
              }
            }, 100);
          } catch (error) {
            console.error('Error en reinicio proactivo:', error);
          }
        } else {
          // Si ya no está grabando, limpiar el intervalo
          if (this.restartInterval) {
            clearInterval(this.restartInterval);
            this.restartInterval = null;
          }
        }
      }, 240000); // 4 minutos = 240000ms (antes del timeout de 5 minutos)
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }

  stopRecording(): void {
    // Limpiar el intervalo de reinicio proactivo
    if (this.restartInterval) {
      clearInterval(this.restartInterval);
      this.restartInterval = null;
    }
    
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  getFullTranscript(): string {
    return this.fullTranscript;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  reset(): void {
    this.fullTranscript = '';
    this.onTranscript = null;
    this.onError = null;
  }
}

export const liveTranscriptionService = new LiveTranscriptionService();
