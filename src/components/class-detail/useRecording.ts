
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useRecording = () => {
  const { toast } = useToast();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';
      
      recognition.onstart = () => {
        console.log('Reconocimiento de voz iniciado');
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        if (event.error === 'no-speech') {
          if (isRecording && !isPaused) {
            setTimeout(() => {
              try {
                recognition.start();
              } catch (e) {
                console.log('Ya está corriendo el reconocimiento');
              }
            }, 1000);
          }
        }
      };
      
      recognition.onend = () => {
        console.log('Reconocimiento de voz terminado');
        setIsListening(false);
        if (isRecording && !isPaused) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Ya está corriendo el reconocimiento');
            }
          }, 500);
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      toast({
        title: "Navegador no compatible",
        description: "Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge para mejor compatibilidad.",
        variant: "destructive"
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);
      setIsPaused(false);
      setTranscript('');
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Grabación iniciada",
        description: "Escuchando y transcribiendo en tiempo real...",
      });
    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono. Verifica los permisos.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        streamRef.current = null;
      }

      toast({
        title: "Grabación finalizada",
        description: "Transcripción completada. Puedes editarla y generar el análisis.",
      });
    }
  };

  const pauseRecording = () => {
    if (isRecording) {
      if (isPaused) {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.resume();
        }
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Reconocimiento ya está corriendo');
          }
        }
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.pause();
        }
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const resetRecording = () => {
    setRecordingTime(0);
    setTranscript('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    isPaused,
    recordingTime,
    transcript,
    isListening,
    setTranscript,
    startRecording,
    stopRecording,
    pauseRecording,
    resetRecording,
    formatTime
  };
};
