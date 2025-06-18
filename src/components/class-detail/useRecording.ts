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
  type: 'teacher' | 'student';
}

interface UseRecordingReturn {
  isRecording: boolean;
  startRecording: (participantId: string) => void;
  stopRecording: (participantId: string) => void;
  transcript: string;
  setTranscript: (value: string) => void;
  participants: Participant[];
  addParticipant: (name: string, type: 'teacher' | 'student') => void;
  removeParticipant: (id: string) => void;
  getCombinedTranscript: () => string;
}

export const useRecording = (languages: string[] = ['en-US', 'es-ES']): UseRecordingReturn => {
  const { toast } = useToast();
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionInstances, setRecognitionInstances] = useState<{ [key: string]: { [lang: string]: any } }>({});
  const [currentTranscripts, setCurrentTranscripts] = useState<{ [key: string]: { text: string; timestamp: number; language: string } }>({});

  const addParticipant = useCallback((name: string, type: 'teacher' | 'student') => {
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isRecording: false,
      transcript: '',
      transcriptHistory: [],
      type
    };
    setParticipants(prev => [...prev, newParticipant]);
  }, []);

  const removeParticipant = useCallback((id: string) => {
    const recognitionInstancesForParticipant = recognitionInstances[id];
    if (recognitionInstancesForParticipant) {
      try {
        Object.values(recognitionInstancesForParticipant).forEach(recognition => {
          recognition.stop();
        });
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

  // Initialize speech recognition for a participant with multiple languages
  const initializeRecognition = useCallback((participantId: string) => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return null;
    }

    // Use only the first language for recognition to avoid duplicates
    const primaryLanguage = languages[0];
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = primaryLanguage;

    recognition.onresult = (event: any) => {
      const participant = participants.find(p => p.id === participantId);
      if (!participant) return;

      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      if (currentTranscript.trim()) {
        const timestamp = new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
        
        setCurrentTranscripts(prev => ({
          ...prev,
          [participantId]: {
            text: `${participant.name} [${timestamp}]: ${currentTranscript}`,
            timestamp: Date.now(),
            language: primaryLanguage
          }
        }));
      }
    };

    recognition.onerror = (event: any) => {
      console.error(`Speech recognition error for ${primaryLanguage}:`, event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
      }
    };

    recognition.onend = () => {
      const participant = participants.find(p => p.id === participantId);
      if (participant?.isRecording) {
        try {
          recognition.start();
        } catch (error) {
          console.error(`Error restarting recognition for ${primaryLanguage}:`, error);
        }
      }
    };

    return { [primaryLanguage]: recognition };
  }, [participants, languages]);

  // Start recording for a specific participant
  const startRecording = useCallback((participantId: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === participantId) {
        return { ...p, isRecording: true };
      }
      return p;
    }));

    let recognitionInstancesForParticipant = recognitionInstances[participantId];
    if (!recognitionInstancesForParticipant) {
      recognitionInstancesForParticipant = initializeRecognition(participantId);
      if (recognitionInstancesForParticipant) {
        setRecognitionInstances(prev => ({
          ...prev,
          [participantId]: recognitionInstancesForParticipant
        }));
      }
    }

    if (recognitionInstancesForParticipant) {
      try {
        // Start all language instances
        Object.values(recognitionInstancesForParticipant).forEach(recognition => {
          recognition.start();
        });
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
        // Only add to history if the transcript is different from the last one
        const lastHistoryItem = p.transcriptHistory[p.transcriptHistory.length - 1];
        const shouldAddToHistory = currentTranscript && 
          currentTranscript.text.trim() !== '' && 
          (!lastHistoryItem || lastHistoryItem.text !== currentTranscript.text);
        
        const newHistory = shouldAddToHistory 
          ? [...p.transcriptHistory, {
              text: currentTranscript.text,
              timestamp: currentTranscript.timestamp
            }]
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

    const recognitionInstancesForParticipant = recognitionInstances[participantId];
    if (recognitionInstancesForParticipant) {
      try {
        // Stop all language instances
        Object.values(recognitionInstancesForParticipant).forEach(recognition => {
          recognition.stop();
        });
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
    // Get all completed transcripts from history
    const allTranscripts = participants
      .map(p => p.transcriptHistory)
      .flat()
      .filter(t => t.text.trim() !== '')
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(t => t.text); // Use the text as is, since it already has the correct format
    
    // Add current active transcripts (only for participants still recording)
    const currentActiveTranscripts = Object.entries(currentTranscripts)
      .filter(([participantId, transcript]) => {
        const participant = participants.find(p => p.id === participantId);
        return participant?.isRecording && transcript.text.trim() !== '';
      })
      .map(([, transcript]) => transcript)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(t => t.text);
    
    // Only include current transcripts if they're not already in history
    const finalTranscripts = [...allTranscripts];
    
    currentActiveTranscripts.forEach(currentText => {
      // Check if this content is already in the history
      const contentMatch = currentText.match(/^[^:]+:\s*(.+)$/);
      const content = contentMatch ? contentMatch[1].trim() : currentText.trim();
      
      const isDuplicate = allTranscripts.some(historyText => {
        const historyContentMatch = historyText.match(/^[^:]+:\s*(.+)$/);
        const historyContent = historyContentMatch ? historyContentMatch[1].trim() : historyText.trim();
        return content === historyContent;
      });
      
      if (!isDuplicate) {
        finalTranscripts.push(currentText);
      }
    });
    
    return finalTranscripts.join('\n\n');
  }, [participants, currentTranscripts]);

  // Single effect to update transcript
  useEffect(() => {
    const combined = getCombinedTranscript();
    setTranscript(combined);
  }, [participants, currentTranscripts, getCombinedTranscript]);

  // Reset recognition instances when languages change
  useEffect(() => {
    // Stop all current recognition instances
    Object.values(recognitionInstances).forEach(participantInstances => {
      Object.values(participantInstances).forEach(recognition => {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      });
    });

    // Clear all instances
    setRecognitionInstances({});
    setCurrentTranscripts({});

    // Restart recording for participants that were recording
    participants.forEach(participant => {
      if (participant.isRecording) {
        setTimeout(() => startRecording(participant.id), 100);
      }
    });
  }, [languages]);

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
