import type { Result } from '@/shared/lib';
import type { ExtractionResult, ExtractTopicsInput } from '../model/types';

type ExtractionError = {
  code: 'EXTRACTION_FAILED';
  message: string;
};

export const extractTopics = async (
  input: ExtractTopicsInput
): Promise<Result<ExtractionResult, ExtractionError>> => {
  // TODO: Implement actual extraction via OpenAI
  // This is a placeholder implementation

  try {
    const result: ExtractionResult = {
      topics: [],
      insights: [],
      suggestedFollowUp: null,
    };

    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'EXTRACTION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};
