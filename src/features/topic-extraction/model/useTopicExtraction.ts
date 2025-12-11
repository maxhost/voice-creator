import { useState, useCallback } from 'react';
import type { AccumulatedContext, ExtractionResult } from './types';

const initialContext: AccumulatedContext = {
  allTopics: [],
  allInsights: [],
  topicFrequency: new Map(),
  lastExtraction: null,
};

export const useTopicExtraction = () => {
  const [context, setContext] = useState<AccumulatedContext>(initialContext);
  const [isExtracting, setIsExtracting] = useState(false);

  const extract = useCallback(async (transcript: string): Promise<ExtractionResult | null> => {
    setIsExtracting(true);

    try {
      // TODO: Implement actual extraction via API
      // For now, return placeholder
      const result: ExtractionResult = {
        topics: [],
        insights: [],
        suggestedFollowUp: null,
      };

      setContext((prev) => ({
        ...prev,
        lastExtraction: result,
      }));

      return result;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setContext(initialContext);
  }, []);

  return {
    context,
    isExtracting,
    extract,
    reset,
  };
};
