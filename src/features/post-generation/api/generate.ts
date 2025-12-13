import type { Result } from '@/shared/lib';
import type { Post } from '@/entities/post';
import type { GeneratePostsInput, GenerationError } from '../model/types';

export const generatePosts = async (
  input: GeneratePostsInput
): Promise<Result<Post[], GenerationError>> => {
  try {
    const response = await fetch('/api/ideas/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        turns: input.turns,
        userProfile: input.userProfile,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error.error || 'Failed to generate ideas',
        },
      };
    }

    const data = await response.json();
    return { ok: true, data: data.posts };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};
