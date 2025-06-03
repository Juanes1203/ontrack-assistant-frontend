
export interface VoiceAnalysis {
  totalSpeakers: number;
  professorSpeechTime: number;
  studentSpeechTime: number;
  questionCount: number;
  interactionCount: number;
}

export interface ContentAnalysis {
  topicsDiscussed: string[];
  conceptsExplained: string[];
  examplesUsed: string[];
  keywordFrequency: { [key: string]: number };
}

export interface ClassAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  studentParticipation: string;
  professorPerformance: string;
  voiceAnalysis: VoiceAnalysis;
  contentAnalysis: ContentAnalysis;
}

export interface ClassData {
  id: string | undefined;
  name: string;
  teacher: string;
  day: string;
  time: string;
  description: string;
  subject: string;
  duration: number;
}
