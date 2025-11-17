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
    // No establecer serviceURI para usar el servicio por defecto del navegador
    // Esto ayuda a mantener la conexión más estable

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
      // Si estaba grabando y se detuvo inesperadamente (no por stopRecording), reiniciar INMEDIATAMENTE
      // Esto es CRÍTICO para mantener la conexión continua
      if (this.isRecording) {
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ Recognition ended - REINICIANDO INMEDIATAMENTE para mantener conexión continua`);
        
        // Función para reiniciar inmediatamente
        const restartImmediately = () => {
          try {
            if (this.recognition && typeof this.recognition.start === 'function') {
              this.recognition.start();
              console.log(`[${new Date().toLocaleTimeString()}] ✅ Recognition reiniciado exitosamente después de onend`);
              return true;
            }
          } catch (error) {
            console.warn(`No se pudo reiniciar la instancia actual:`, error);
            return false;
          }
          return false;
        };

        // Intentar reiniciar inmediatamente (sin delay)
        if (!restartImmediately()) {
          // Si falla, reinicializar completamente
          console.warn(`[${new Date().toLocaleTimeString()}] Reinicializando reconocimiento...`);
          try {
            this.initializeRecognition();
            if (this.isRecording && this.recognition) {
              try {
                this.recognition.start();
                console.log(`[${new Date().toLocaleTimeString()}] ✅ Recognition reinicializado y activado después de onend`);
              } catch (reinitError) {
                console.error('Error iniciando reconocimiento reinicializado:', reinitError);
                // Último intento: esperar un momento mínimo y reintentar
                setTimeout(() => {
                  if (restartImmediately()) {
                    console.log(`[${new Date().toLocaleTimeString()}] ✅ Reconexión exitosa después de retry`);
                  } else {
                    // Si todo falla, reinicializar una vez más
                    try {
                      this.initializeRecognition();
                      if (this.recognition) {
                        this.recognition.start();
                        console.log(`[${new Date().toLocaleTimeString()}] ✅ Reconexión de emergencia exitosa`);
                      }
                    } catch (finalError) {
                      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error crítico: No se pudo mantener la conexión:`, finalError);
                      this.isRecording = false;
                      if (this.onError) {
                        this.onError('Recording stopped unexpectedly. Please restart manually.');
                      }
                    }
                  }
                }, 50); // Delay mínimo de 50ms
              }
            }
          } catch (error) {
            console.error('Error reinicializando después de onend:', error);
            // Último recurso: intentar reiniciar la instancia actual después de un breve delay
            setTimeout(() => {
              if (!restartImmediately()) {
                console.error(`[${new Date().toLocaleTimeString()}] ❌ No se pudo mantener la conexión después de múltiples intentos`);
                this.isRecording = false;
                if (this.onError) {
                  this.onError('Recording stopped unexpectedly. Please restart manually.');
                }
              }
            }, 100);
          }
        }
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
      
      // Iniciar reinicio proactivo cada 1.5 minutos (90000ms) para NUNCA llegar al timeout
      // MUY frecuente para garantizar que nunca se desconecte
      this.restartInterval = setInterval(() => {
        if (this.isRecording && this.recognition) {
          console.log(`[${new Date().toLocaleTimeString()}] Proactive restart: Reiniciando reconocimiento (cada 1.5 min - prevención activa)`);
          try {
            if (this.recognition && typeof this.recognition.stop === 'function') {
              this.recognition.stop();
              setTimeout(() => {
                try {
                  if (this.recognition && typeof this.recognition.start === 'function') {
                    this.recognition.start();
                    console.log(`[${new Date().toLocaleTimeString()}] Proactive restart: Reconocimiento reiniciado exitosamente`);
                  } else {
                    console.warn('Recognition instance invalid, reinitializing...');
                    this.initializeRecognition();
                    if (this.isRecording && this.recognition) {
                      setTimeout(() => {
                        try {
                          this.recognition.start();
                          console.log('Reinitialized and restarted after invalid instance');
                        } catch (finalError) {
                          console.error('Failed to restart after reinitialization:', finalError);
                        }
                      }, 200);
                    }
                  }
                } catch (restartError) {
                  console.error('Error en reinicio proactivo:', restartError);
                  // Si falla, intentar reinicializar completamente
                  this.initializeRecognition();
                  if (this.isRecording && this.recognition) {
                    setTimeout(() => {
                      try {
                        this.recognition.start();
                        console.log('Reinitialized and restarted after proactive restart failure');
                      } catch (finalError) {
                        console.error('Failed to restart after reinitialization:', finalError);
                      }
                    }, 200);
                  }
                }
              }, 200); // Aumentar delay a 200ms para asegurar que se detuvo
            }
          } catch (error) {
            console.error('Error en reinicio proactivo:', error);
            // Si hay un error, intentar reinicializar
            try {
              this.initializeRecognition();
              if (this.isRecording && this.recognition) {
                setTimeout(() => {
                  try {
                    this.recognition.start();
                    console.log('Reinitialized after error in proactive restart');
                  } catch (finalError) {
                    console.error('Failed to restart after error:', finalError);
                  }
                }, 200);
              }
            } catch (reinitError) {
              console.error('Failed to reinitialize after error:', reinitError);
            }
          }
        } else {
          // Si ya no está grabando, limpiar el intervalo
          if (this.restartInterval) {
            clearInterval(this.restartInterval);
            this.restartInterval = null;
          }
        }
      }, 90000); // 1.5 minutos = 90000ms (MUY frecuente para NUNCA llegar al timeout)
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
