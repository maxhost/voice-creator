export type Speaker = 'user' | 'ai';

export type Turn = {
  id: string;
  speaker: Speaker;
  transcript: string;
  timestamp: number;
  extractedTopics: string[];
};

export type Topic = {
  id: string;
  name: string;
  relevanceScore: number;
  mentionCount: number;
  firstMentionedAt: number;
  relatedTurnIds: string[];
};

export type InsightType =
  | 'pain_point'
  | 'success_story'
  | 'opinion'
  | 'experience'
  | 'tip';

export type Insight = {
  id: string;
  type: InsightType;
  content: string;
  sourceTurnId: string;
};

export type InterviewSession = {
  id: string;
  startedAt: number;
  endedAt: number | null;
  turns: Turn[];
  topics: Topic[];
  insights: Insight[];
  metadata: InterviewMetadata;
};

export type InterviewMetadata = {
  totalUserWords: number;
  totalAiWords: number;
  dominantThemes: string[];
  durationSeconds: number;
};
