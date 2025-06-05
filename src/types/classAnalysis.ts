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

export interface RubricEvaluation {
  domainKnowledge: number;
  teachingMethodology: number;
  studentEngagement: number;
  classroomManagement: number;
  communicationSkills: number;
  comments: string[];
}

export interface StructuredObservation {
  planningAndPreparation: string[];
  instructionalDelivery: string[];
  classroomEnvironment: string[];
  professionalResponsibilities: string[];
}

export interface Feedback360 {
  selfEvaluation: string[];
  studentPerspective: string[];
  peerObservations: string[];
  improvementAreas: string[];
}

export interface TeachingPortfolio {
  strengths: string[];
  innovativePractices: string[];
  studentLearningEvidence: string[];
  reflectiveInsights: string[];
}

export interface ECDFModel {
  domainExpertise: string;
  pedagogicalKnowledge: string;
  contextualKnowledge: string;
  professionalDevelopment: string;
  score: number;
}

export interface ClassObjective {
  mainObjective: string;
  specificObjectives: string[];
  achievementStatus: 'achieved' | 'partially_achieved' | 'not_achieved';
  evidence: string[];
  recommendations: string[];
}

export interface ClassAnalysis {
  summary: string;
  rubricEvaluation: RubricEvaluation;
  structuredObservation: StructuredObservation;
  feedback360: Feedback360;
  teachingPortfolio: TeachingPortfolio;
  ecdfModel: ECDFModel;
  studentParticipation: string;
  professorPerformance: string;
  voiceAnalysis: VoiceAnalysis;
  contentAnalysis: ContentAnalysis;
  classObjective: ClassObjective;
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
