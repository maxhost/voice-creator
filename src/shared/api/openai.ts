import OpenAI from 'openai';

/**
 * OpenAI client for server-side operations only.
 * Never expose to client.
 * Lazy initialization to avoid build-time errors.
 */
let openaiClient: OpenAI | null = null;

export const getOpenAI = (): OpenAI => {
  if (openaiClient) return openaiClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
};
