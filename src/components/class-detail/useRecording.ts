import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface TranscriptEntry {
  text: string;
  timestamp: number;
}

interface Participant {
  id: string;
  name: string;
  isRecording: boolean;
  transcript: string;
  transcriptHistory: TranscriptEntry[];
}

interface UseRecordingReturn {
  isRecording: boolean;
  startRecording: (participantId: string) => void;
  stopRecording: (participantId: string) => void;
  transcript: string;
  setTranscript: (value: string) => void;
  participants: Participant[];
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  getCombinedTranscript: () => string;
}

export const useRecording = (): UseRecordingReturn => {
  const { toast } = useToast();
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionInstances, setRecognitionInstances] = useState<{ [key: string]: any }>({});
  const [currentTranscripts, setCurrentTranscripts] = useState<{ [key: string]: { text: string; timestamp: number } }>({});

  const addParticipant = useCallback((name: string) => {
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isRecording: false,
      transcript: '',
      transcriptHistory: []
    };
    setParticipants(prev => [...prev, newParticipant]);
  }, []);

  const removeParticipant = useCallback((id: string) => {
    const recognition = recognitionInstances[id];
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }

    setParticipants(prev => prev.filter(p => p.id !== id));
    setRecognitionInstances(prev => {
      const newInstances = { ...prev };
      delete newInstances[id];
      return newInstances;
    });
    setCurrentTranscripts(prev => {
      const newTranscripts = { ...prev };
      delete newTranscripts[id];
      return newTranscripts;
    });
  }, [recognitionInstances]);

  // Initialize speech recognition for a participant
  const initializeRecognition = useCallback((participantId: string) => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return null;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onresult = (event: any) => {
      const participant = participants.find(p => p.id === participantId);
      if (!participant) return;

      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      setCurrentTranscripts(prev => ({
        ...prev,
        [participantId]: {
          text: `${participant.name}: ${currentTranscript}`,
          timestamp: Date.now()
        }
      }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
      }
    };

    recognition.onend = () => {
      const participant = participants.find(p => p.id === participantId);
      if (participant?.isRecording) {
        recognition.start();
      }
    };

    return recognition;
  }, [participants]);

  // Start recording for a specific participant
  const startRecording = useCallback((participantId: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === participantId) {
        return { ...p, isRecording: true };
      }
      return p;
    }));

    let recognition = recognitionInstances[participantId];
    if (!recognition) {
      recognition = initializeRecognition(participantId);
      if (recognition) {
        setRecognitionInstances(prev => ({
          ...prev,
          [participantId]: recognition
        }));
      }
    }

    if (recognition) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [initializeRecognition, recognitionInstances]);

  // Stop recording for a specific participant
  const stopRecording = useCallback((participantId: string) => {
    const currentTranscript = currentTranscripts[participantId];
    
    setParticipants(prev => prev.map(p => {
      if (p.id === participantId) {
        // Add current transcript to history if it's not empty
        const newHistory = currentTranscript && currentTranscript.text.trim() 
          ? [...p.transcriptHistory, currentTranscript]
          : p.transcriptHistory;
        
        return { 
          ...p, 
          isRecording: false,
          transcriptHistory: newHistory
        };
      }
      return p;
    }));

    // Clear the current transcript for this participant
    setCurrentTranscripts(prev => {
      const newTranscripts = { ...prev };
      delete newTranscripts[participantId];
      return newTranscripts;
    });

    const recognition = recognitionInstances[participantId];
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }

    // Check if any participant is still recording
    const anyRecording = participants.some(p => p.id !== participantId && p.isRecording);
    setIsRecording(anyRecording);
  }, [participants, recognitionInstances, currentTranscripts]);

  // Get combined transcript from all participants
  const getCombinedTranscript = useCallback(() => {
    const allTranscripts = participants
      .map(p => p.transcriptHistory)
      .flat()
      .filter(t => t.text.trim() !== '')
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(t => t.text);
    
    return allTranscripts.join('\n\n');
  }, [participants]);

  // Update combined transcript whenever any participant's transcript changes
  useEffect(() => {
    const combined = getCombinedTranscript();
    setTranscript(combined);
  }, [participants, getCombinedTranscript]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    setTranscript,
    participants,
    addParticipant,
    removeParticipant,
    getCombinedTranscript
  };
};
