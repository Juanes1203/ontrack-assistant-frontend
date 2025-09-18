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
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isRecording = false;
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
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }

  stopRecording(): void {
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
