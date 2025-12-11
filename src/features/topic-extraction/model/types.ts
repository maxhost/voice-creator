import type { Topic, Insight } from '@/entities/interview-session';

export type ExtractionResult = {
  topics: Topic[];
  insights: Insight[];
  suggestedFollowUp: string | null;
};

export type AccumulatedContext = {
  allTopics: Topic[];
  allInsights: Insight[];
  topicFrequency: Map<string, number>;
  lastExtraction: ExtractionResult | null;
};

export type ExtractTopicsInput = {
  transcript: string;
  previousContext: AccumulatedContext;
  turnNumber: number;
};
