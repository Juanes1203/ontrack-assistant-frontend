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
  private isRestarting = false; // Flag para prevenir múltiples reinicios simultáneos
  private healthCheckInterval: NodeJS.Timeout | null = null; // Intervalo para verificar salud del reconocimiento
  private lastResultTime: number = 0; // Timestamp del último resultado recibido

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
      // Actualizar timestamp del último resultado para health check
      this.lastResultTime = Date.now();
      
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
      
      // Manejar error "abortado" - no es un error crítico, solo significa que se reinició
      if (event.error === 'aborted') {
        console.log('Recognition aborted (normal durante reinicio proactivo)');
        // No llamar onError para "aborted" ya que es parte del proceso normal de reinicio
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
      if (this.isRecording && !this.isRestarting) {
        this.isRestarting = true; // Prevenir múltiples reinicios simultáneos
        
        // Actualizar timestamp para que el health check no detecte esto como un problema
        this.lastResultTime = Date.now();
        
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ Recognition ended - REINICIANDO INMEDIATAMENTE para mantener conexión continua`);
        
        // Función para verificar si el reconocimiento está iniciado
        const isRecognitionActive = () => {
          try {
            // No hay una forma directa de verificar el estado, pero podemos intentar
            // Si el reconocimiento existe y no está null, asumimos que puede estar activo
            return this.recognition !== null;
          } catch {
            return false;
          }
        };

        // Función para reiniciar con verificación de estado
        const restartSafely = () => {
          try {
            if (!this.recognition || typeof this.recognition.start !== 'function') {
              this.isRestarting = false;
              return false;
            }
            
            // Intentar detener primero si está activo (sin lanzar error si ya está detenido)
            try {
              if (typeof this.recognition.stop === 'function') {
                this.recognition.stop();
              }
            } catch (stopError) {
              // Ignorar errores al detener (puede que ya esté detenido)
            }
            
            // Esperar un momento mínimo antes de reiniciar
            setTimeout(() => {
              if (!this.isRecording) {
                this.isRestarting = false;
                return;
              }
              
              try {
                if (this.recognition && typeof this.recognition.start === 'function' && this.isRecording) {
                  this.recognition.start();
                  console.log(`[${new Date().toLocaleTimeString()}] ✅ Recognition reiniciado exitosamente después de onend`);
                  this.isRestarting = false;
                }
              } catch (startError: any) {
                if (startError.name === 'InvalidStateError' && startError.message.includes('already started')) {
                  // Ya está iniciado, eso está bien - no es un error
                  console.log(`[${new Date().toLocaleTimeString()}] ℹ️ Recognition ya estaba iniciado`);
                  this.isRestarting = false;
                } else {
                  console.warn(`Error al reiniciar:`, startError);
                  this.isRestarting = false;
                  // Si falla, intentar reinicializar
                  setTimeout(() => {
                    if (this.isRecording && !this.isRestarting) {
                      this.isRestarting = true;
                      try {
                        this.initializeRecognition();
                        if (this.recognition && this.isRecording) {
                          setTimeout(() => {
                            try {
                              if (this.recognition && typeof this.recognition.start === 'function' && this.isRecording) {
                                this.recognition.start();
                                console.log(`[${new Date().toLocaleTimeString()}] ✅ Recognition reinicializado después de error`);
                                this.isRestarting = false;
                              }
                            } catch (reinitError: any) {
                              if (reinitError.name === 'InvalidStateError' && reinitError.message.includes('already started')) {
                                console.log(`[${new Date().toLocaleTimeString()}] ℹ️ Recognition ya estaba iniciado después de reinicializar`);
                                this.isRestarting = false;
                              } else {
                                console.error(`Error crítico: No se pudo mantener la conexión:`, reinitError);
                                this.isRestarting = false;
                                this.isRecording = false;
                                if (this.onError) {
                                  this.onError('Recording stopped unexpectedly. Please restart manually.');
                                }
                              }
                            }
                          }, 50);
                        }
                      } catch (error) {
                        console.error('Error reinicializando:', error);
                        this.isRestarting = false;
                      }
                    }
                  }, 100);
                }
              }
            }, 100); // Delay de 100ms para asegurar que el reconocimiento terminó
            
            return true;
          } catch (error) {
            console.warn(`No se pudo reiniciar la instancia actual:`, error);
            this.isRestarting = false;
            return false;
          }
        };

        // Intentar reiniciar de forma segura (la función ya maneja los delays y errores)
        restartSafely();
      } else {
        this.isRecording = false;
        this.isRestarting = false;
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
      // Verificar que el navegador soporte getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso al micrófono. Por favor usa Chrome, Firefox o Edge.');
      }

      // Listar dispositivos disponibles primero
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        if (audioDevices.length === 0) {
          throw new Error('No se encontró ningún micrófono conectado. Por favor conecta un micrófono y recarga la página.');
        }
      } catch (enumError) {
        // Si no podemos enumerar, continuamos de todas formas
        console.warn('No se pudieron enumerar dispositivos:', enumError);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      console.log('Microphone permission granted');
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      
      // Mensajes de error más específicos
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

    this.onTranscript = onTranscript;
    this.onError = onError;
    this.fullTranscript = '';

    try {
      this.recognition.start();
      this.isRecording = true;
      this.lastResultTime = Date.now(); // Inicializar timestamp
      console.log('Live transcription started successfully');
      
      // Health check cada 15 segundos para detectar si el reconocimiento se detuvo silenciosamente
      // MÁS AGRESIVO para grabaciones de 30+ minutos
      this.healthCheckInterval = setInterval(() => {
        if (this.isRecording && this.recognition) {
          const timeSinceLastResult = Date.now() - this.lastResultTime;
          // Si no hay resultados en 45 segundos, algo está mal (reducido de 2 min a 45s)
          if (timeSinceLastResult > 45000) {
            console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ Health check: No hay resultados desde hace ${Math.round(timeSinceLastResult / 1000)}s - reiniciando reconocimiento`);
            this.forceRestart();
          } else if (timeSinceLastResult > 30000) {
            // Advertencia si no hay resultados en 30 segundos
            console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ Health check: Sin resultados hace ${Math.round(timeSinceLastResult / 1000)}s - monitoreando...`);
          } else {
            console.log(`[${new Date().toLocaleTimeString()}] ✅ Health check: Reconocimiento activo (último resultado hace ${Math.round(timeSinceLastResult / 1000)}s)`);
          }
        }
      }, 15000); // Cada 15 segundos (más frecuente)
      
      // Iniciar reinicio proactivo cada 45 segundos (45000ms) - MUY FRECUENTE para grabaciones de 30+ minutos
      // Reducido a 45s para prevenir cualquier timeout del navegador
      this.restartInterval = setInterval(() => {
        if (this.isRecording && this.recognition && !this.isRestarting) {
          this.isRestarting = true; // Prevenir múltiples reinicios simultáneos
          
          console.log(`[${new Date().toLocaleTimeString()}] Proactive restart: Reiniciando reconocimiento (cada 45s - prevención activa para grabaciones de 30+ min)`);
          try {
            if (this.recognition && typeof this.recognition.stop === 'function') {
              this.recognition.stop();
              setTimeout(() => {
                if (!this.isRecording) {
                  this.isRestarting = false;
                  return;
                }
                
                try {
                  if (this.recognition && typeof this.recognition.start === 'function') {
                    this.recognition.start();
                    console.log(`[${new Date().toLocaleTimeString()}] Proactive restart: Reconocimiento reiniciado exitosamente`);
                    this.isRestarting = false;
                  } else {
                    console.warn('Recognition instance invalid, reinitializing...');
                    this.initializeRecognition();
                    if (this.isRecording && this.recognition) {
                      setTimeout(() => {
                        try {
                          if (this.recognition && typeof this.recognition.start === 'function' && this.isRecording) {
                            this.recognition.start();
                            console.log('Reinitialized and restarted after invalid instance');
                            this.isRestarting = false;
                          }
                        } catch (finalError: any) {
                          if (finalError.name === 'InvalidStateError' && finalError.message.includes('already started')) {
                            console.log('Recognition already started after reinitialization');
                            this.isRestarting = false;
                          } else {
                            console.error('Failed to restart after reinitialization:', finalError);
                            this.isRestarting = false;
                          }
                        }
                      }, 200);
                    } else {
                      this.isRestarting = false;
                    }
                  }
                } catch (restartError: any) {
                  // Verificar si el error es "already started" - esto NO es un error, es normal
                  const isAlreadyStarted = restartError?.name === 'InvalidStateError' || 
                                          restartError?.message?.includes('already started') ||
                                          restartError?.toString()?.includes('already started');
                  
                  if (isAlreadyStarted) {
                    // Ya está iniciado, eso está bien - no es un error, no hacer nada
                    console.log(`[${new Date().toLocaleTimeString()}] ℹ️ Recognition ya estaba iniciado en reinicio proactivo (normal)`);
                    this.isRestarting = false;
                    return; // Salir temprano, no intentar reinicializar
                  } else {
                    // Solo reinicializar si es un error REAL (no "already started")
                    console.error('Error en reinicio proactivo:', restartError);
                    // Si falla con un error real, intentar reinicializar completamente
                    this.initializeRecognition();
                    if (this.isRecording && this.recognition) {
                      setTimeout(() => {
                        try {
                          if (this.recognition && typeof this.recognition.start === 'function' && this.isRecording) {
                            this.recognition.start();
                            console.log('Reinitialized and restarted after proactive restart failure');
                            this.isRestarting = false;
                          }
                        } catch (finalError: any) {
                          const isFinalAlreadyStarted = finalError?.name === 'InvalidStateError' || 
                                                       finalError?.message?.includes('already started') ||
                                                       finalError?.toString()?.includes('already started');
                          
                          if (isFinalAlreadyStarted) {
                            console.log('Recognition already started after reinitialization (normal)');
                            this.isRestarting = false;
                          } else {
                            console.error('Failed to restart after reinitialization:', finalError);
                            this.isRestarting = false;
                          }
                        }
                      }, 200);
                    } else {
                      this.isRestarting = false;
                    }
                  }
                }
              }, 200); // Delay de 200ms para asegurar que se detuvo
            } else {
              this.isRestarting = false;
            }
          } catch (error) {
            console.error('Error en reinicio proactivo:', error);
            this.isRestarting = false;
            // Si hay un error, intentar reinicializar
            try {
              this.initializeRecognition();
              if (this.isRecording && this.recognition) {
                setTimeout(() => {
                  try {
                    if (this.recognition && typeof this.recognition.start === 'function' && this.isRecording) {
                      this.recognition.start();
                      console.log('Reinitialized after error in proactive restart');
                      this.isRestarting = false;
                    }
                  } catch (finalError: any) {
                    if (finalError.name === 'InvalidStateError' && finalError.message.includes('already started')) {
                      console.log('Recognition already started after reinitialization');
                      this.isRestarting = false;
                    } else {
                      console.error('Failed to restart after error:', finalError);
                      this.isRestarting = false;
                    }
                  }
                }, 200);
              } else {
                this.isRestarting = false;
              }
            } catch (reinitError) {
              console.error('Failed to reinitialize after error:', reinitError);
              this.isRestarting = false;
            }
          }
        } else {
          // Si ya no está grabando, limpiar el intervalo
          if (this.restartInterval) {
            clearInterval(this.restartInterval);
            this.restartInterval = null;
          }
        }
      }, 45000); // 45 segundos = 45000ms (MUY frecuente para grabaciones de 30+ minutos)
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }

  // Método para forzar reinicio cuando el health check detecta problemas
  private forceRestart(): void {
    if (!this.isRecording || this.isRestarting) {
      return;
    }
    
    this.isRestarting = true;
    console.log(`[${new Date().toLocaleTimeString()}] 🔄 Force restart: Reiniciando reconocimiento por health check`);
    
    try {
      if (this.recognition && typeof this.recognition.stop === 'function') {
        this.recognition.stop();
      }
    } catch (stopError) {
      // Ignorar errores al detener
    }
    
    setTimeout(() => {
      if (!this.isRecording) {
        this.isRestarting = false;
        return;
      }
      
      try {
        // Reinicializar completamente
        this.initializeRecognition();
        if (this.recognition && this.isRecording) {
          setTimeout(() => {
            try {
              if (this.recognition && typeof this.recognition.start === 'function' && this.isRecording) {
                this.recognition.start();
                this.lastResultTime = Date.now(); // Resetear timestamp
                console.log(`[${new Date().toLocaleTimeString()}] ✅ Force restart: Reconocimiento reiniciado exitosamente`);
                this.isRestarting = false;
              }
            } catch (startError: any) {
              if (startError.name === 'InvalidStateError' && startError.message.includes('already started')) {
                console.log(`[${new Date().toLocaleTimeString()}] ℹ️ Force restart: Recognition ya estaba iniciado`);
                this.lastResultTime = Date.now();
                this.isRestarting = false;
              } else {
                console.error('Force restart: Error al iniciar:', startError);
                this.isRestarting = false;
              }
            }
          }, 200);
        } else {
          this.isRestarting = false;
        }
      } catch (error) {
        console.error('Force restart: Error reinicializando:', error);
        this.isRestarting = false;
      }
    }, 200);
  }

  stopRecording(): void {
    // Limpiar el intervalo de reinicio proactivo
    if (this.restartInterval) {
      clearInterval(this.restartInterval);
      this.restartInterval = null;
    }
    
    // Limpiar el health check interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
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
