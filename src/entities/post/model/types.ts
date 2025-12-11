import type { SupportedPlatform } from '@/shared/config/constants';

export type ContentType =
  | 'text'
  | 'carousel'
  | 'video'
  | 'thread'
  | 'story'
  | 'reel';

export type EngagementLevel = 'low' | 'medium' | 'high';

export type Post = {
  id: string;
  title: string;
  description: string;
  platform: SupportedPlatform;
  contentType: ContentType;
  basedOnInsightId: string;
  suggestedHooks: string[];
  keyPoints: string[];
  estimatedEngagement: EngagementLevel;
};

export type PostDraft = Omit<Post, 'id'>;
