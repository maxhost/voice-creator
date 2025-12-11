import { useAppMachine } from '@/app/providers';

export const usePostGeneration = () => {
  const { state, send, context } = useAppMachine();

  const startGeneration = () => {
    send({ type: 'START_GENERATION' });
  };

  const isGenerating = state.matches('generating.inProgress');
  const isComplete = context.generation.status === 'complete';
  const isFailed = context.generation.status === 'failed';

  return {
    posts: context.generation.posts,
    progress: context.generation.progress,
    status: context.generation.status,
    isGenerating,
    isComplete,
    isFailed,
    startGeneration,
  };
};
