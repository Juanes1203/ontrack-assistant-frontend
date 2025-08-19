interface WhisperXResult {
  segments: Array<{
    start: number;
    end: number;
    text: string;
    speaker?: string;
    words?: Array<{
      start: number;
      end: number;
      word: string;
      speaker?: string;
    }>;
  }>;
  speakers: Array<{
    id: string;
    type: 'professor' | 'student';
    confidence: number;
  }>;
  language: string;
  duration: number;
}

interface WhisperXOptions {
  model?: 'tiny' | 'base' | 'small' | 'medium' | 'large' | 'large-v2' | 'large-v3';
  language?: string;
  compute_type?: 'float16' | 'int8';
  batch_size?: number;
  diarize?: boolean;
  min_speakers?: number;
  max_speakers?: number;
}

export class WhisperXService {
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl: string = 'http://localhost:5001/api/whisperx', apiKey?: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async transcribeAudio(
    audioFile: File | Blob,
    options: WhisperXOptions = {}
  ): Promise<WhisperXResult> {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      // Add options to form data
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.apiUrl}/transcribe`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`WhisperX API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Raw response from backend:', result);
      
      // Verificar si la respuesta tiene el formato esperado
      if (result.success && result.data) {
        console.log('Processing wrapped response format');
        return this.processWhisperXResult(result.data);
      } else if (result.segments) {
        // Formato directo (sin wrapper)
        console.log('Processing direct response format');
        return this.processWhisperXResult(result);
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Formato de respuesta inesperado del servidor');
      }
    } catch (error) {
      console.error('Error transcribing audio with WhisperX:', error);
      throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private processWhisperXResult(rawResult: any): WhisperXResult {
    console.log('Processing WhisperX result:', rawResult);
    
    // Process the raw WhisperX result to match our interface
    const segments = rawResult.segments?.map((segment: any) => ({
      start: segment.start,
      end: segment.end,
      text: segment.text,
      speaker: segment.speaker,
      words: segment.words?.map((word: any) => ({
        start: word.start,
        end: word.end,
        word: word.word,
        speaker: word.speaker,
      })),
    })) || [];

    console.log('Processed segments:', segments);

    // Extract speaker information
    const speakers = this.extractSpeakers(segments);
    console.log('Extracted speakers:', speakers);

    const result = {
      segments,
      speakers,
      language: rawResult.language || 'unknown',
      duration: rawResult.duration || 0,
    };

    console.log('Final processed result:', result);
    return result;
  }

  private extractSpeakers(segments: any[]): Array<{ id: string; type: 'professor' | 'student'; confidence: number }> {
    const speakerMap = new Map<string, { count: number; totalConfidence: number }>();

    segments.forEach(segment => {
      if (segment.speaker) {
        const existing = speakerMap.get(segment.speaker);
        if (existing) {
          existing.count++;
          existing.totalConfidence += 0.8; // Default confidence
        } else {
          speakerMap.set(segment.speaker, { count: 1, totalConfidence: 0.8 });
        }
      }
    });

    return Array.from(speakerMap.entries()).map(([id, data]) => ({
      id,
      type: this.classifySpeakerType(id, data.count),
      confidence: data.totalConfidence / data.count,
    }));
  }

  private classifySpeakerType(speakerId: string, segmentCount: number): 'professor' | 'student' {
    // Simple heuristic: speaker with most segments is likely the professor
    // This could be improved with more sophisticated analysis
    return segmentCount > 5 ? 'professor' : 'student';
  }

  // Helper method to convert segments to transcript format
  formatTranscript(segments: any[]): string {
    return segments
      .map(segment => {
        const timestamp = this.formatTimestamp(segment.start);
        const speaker = segment.speaker ? `[${segment.speaker}]` : '';
        return `${speaker} [${timestamp}]: ${segment.text}`;
      })
      .join('\n\n');
  }

  private formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Method to get detailed participation analysis
  getParticipationAnalysis(segments: any[]): {
    totalTime: number;
    speakerStats: Record<string, { time: number; segments: number; words: number }>;
    interactionPatterns: Array<{ from: string; to: string; count: number }>;
  } {
    const speakerStats: Record<string, { time: number; segments: number; words: number }> = {};
    const interactions: Array<{ from: string; to: string; count: number }> = [];

    segments.forEach((segment, index) => {
      const speaker = segment.speaker || 'unknown';
      const duration = segment.end - segment.start;
      const wordCount = segment.text.split(' ').length;

      // Update speaker stats
      if (!speakerStats[speaker]) {
        speakerStats[speaker] = { time: 0, segments: 0, words: 0 };
      }
      speakerStats[speaker].time += duration;
      speakerStats[speaker].segments += 1;
      speakerStats[speaker].words += wordCount;

      // Track interactions (who speaks after whom)
      if (index > 0) {
        const previousSpeaker = segments[index - 1].speaker || 'unknown';
        const interaction = interactions.find(i => i.from === previousSpeaker && i.to === speaker);
        if (interaction) {
          interaction.count++;
        } else {
          interactions.push({ from: previousSpeaker, to: speaker, count: 1 });
        }
      }
    });

    const totalTime = segments.reduce((total, segment) => total + (segment.end - segment.start), 0);

    return {
      totalTime,
      speakerStats,
      interactionPatterns: interactions,
    };
  }
} 