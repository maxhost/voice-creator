import { createMachine, assign } from 'xstate';
import type { AppContext, AppEvents } from './types';
import { INTERVIEW_DURATION_SECONDS } from '@/shared/config/constants';

const initialContext: AppContext = {
  sessionId: null,
  userProfile: null,
  payment: {
    status: 'idle',
    intentId: null,
    error: null,
  },
  interview: {
    turns: [],
    topics: [],
    insights: [],
    timeRemaining: INTERVIEW_DURATION_SECONDS,
    lastSpeaker: null,
    currentAudioUrl: null,
  },
  generation: {
    status: 'idle',
    progress: 0,
    posts: [],
  },
  error: null,
};

export const appMachine = createMachine({
  id: 'app',
  initial: 'idle',
  context: initialContext,
  types: {
    context: {} as AppContext,
    events: {} as AppEvents,
  },

  states: {
    idle: {
      on: {
        // Payment is now handled via Stripe redirect
        // User clicks CTA → redirects to Stripe → returns to /interview?session_id=xxx
        START_INTERVIEW: {
          target: 'onboarding',
          actions: assign({
            sessionId: ({ event }) => event.sessionId,
            payment: ({ context }) => ({
              ...context.payment,
              status: 'confirmed' as const,
            }),
          }),
        },
      },
    },

    onboarding: {
      on: {
        COMPLETE_ONBOARDING: {
          target: 'interview',
          actions: assign({
            userProfile: ({ event }) => event.userProfile,
          }),
        },
      },
    },

    interview: {
      initial: 'greeting',
      states: {
        greeting: {
          on: {
            AI_RESPONSE_READY: {
              target: 'playingResponse',
              actions: assign({
                interview: ({ context, event }) => ({
                  ...context.interview,
                  lastSpeaker: 'ai' as const,
                  currentAudioUrl: event.audioUrl,
                  turns: [
                    ...context.interview.turns,
                    {
                      id: `turn-${Date.now()}`,
                      speaker: 'ai' as const,
                      transcript: event.response,
                      timestamp: Date.now(),
                      extractedTopics: [],
                    },
                  ],
                }),
              }),
            },
            SET_ERROR: {
              target: 'waitingForUser',
              actions: assign({
                error: ({ event }) => event.error,
              }),
            },
            TIMER_END: 'closing',
          },
        },
        waitingForUser: {
          on: {
            START_RECORDING: 'recording',
            TIMER_END: 'closing',
          },
        },
        recording: {
          on: {
            STOP_RECORDING: {
              target: 'transcribing',
            },
          },
        },
        transcribing: {
          on: {
            TRANSCRIPTION_COMPLETE: {
              target: 'aiResponding',
              actions: assign({
                interview: ({ context, event }) => ({
                  ...context.interview,
                  lastSpeaker: 'user' as const,
                  turns: [
                    ...context.interview.turns,
                    {
                      id: `turn-${Date.now()}`,
                      speaker: 'user' as const,
                      transcript: event.transcript,
                      timestamp: Date.now(),
                      extractedTopics: event.topics,
                    },
                  ],
                }),
              }),
            },
            SET_ERROR: {
              target: 'waitingForUser',
              actions: assign({
                error: ({ event }) => event.error,
              }),
            },
          },
        },
        aiResponding: {
          on: {
            AI_RESPONSE_READY: {
              target: 'playingResponse',
              actions: assign({
                interview: ({ context, event }) => ({
                  ...context.interview,
                  lastSpeaker: 'ai' as const,
                  currentAudioUrl: event.audioUrl,
                  turns: [
                    ...context.interview.turns,
                    {
                      id: `turn-${Date.now()}`,
                      speaker: 'ai' as const,
                      transcript: event.response,
                      timestamp: Date.now(),
                      extractedTopics: [],
                    },
                  ],
                }),
              }),
            },
            SET_ERROR: {
              target: 'waitingForUser',
              actions: assign({
                error: ({ event }) => event.error,
              }),
            },
          },
        },
        playingResponse: {
          on: {
            AUDIO_PLAYBACK_COMPLETE: 'waitingForUser',
          },
        },
        closing: {
          always: [
            {
              guard: ({ context }) => context.interview.lastSpeaker === 'ai',
              target: 'finalResponse',
            },
            {
              target: '#app.generating',
            },
          ],
        },
        finalResponse: {
          on: {
            FINAL_RESPONSE: {
              target: '#app.generating',
            },
            SKIP_FINAL_RESPONSE: {
              target: '#app.generating',
            },
          },
          after: {
            30000: {
              target: '#app.generating',
            },
          },
        },
      },
      on: {
        TIMER_TICK: {
          actions: assign({
            interview: ({ context }) => ({
              ...context.interview,
              timeRemaining: Math.max(0, context.interview.timeRemaining - 1),
            }),
          }),
        },
      },
    },

    generating: {
      initial: 'inProgress',
      states: {
        inProgress: {
          entry: assign({
            generation: ({ context }) => ({
              ...context.generation,
              status: 'generating' as const,
              progress: 0,
            }),
          }),
          on: {
            GENERATION_PROGRESS: {
              actions: assign({
                generation: ({ context, event }) => ({
                  ...context.generation,
                  progress: event.progress,
                }),
              }),
            },
            GENERATION_COMPLETE: {
              target: '#app.results',
              actions: assign({
                generation: ({ event }) => ({
                  status: 'complete' as const,
                  progress: 100,
                  posts: event.posts,
                }),
              }),
            },
            GENERATION_FAILED: {
              target: 'failed',
              actions: assign({
                generation: ({ context, event }) => ({
                  ...context.generation,
                  status: 'failed' as const,
                }),
                error: ({ event }) => ({
                  code: 'GENERATION_FAILED',
                  message: event.error,
                  retryable: true,
                }),
              }),
            },
          },
        },
        failed: {
          on: {
            START_GENERATION: 'inProgress',
          },
        },
      },
    },

    results: {
      on: {
        RESET: {
          target: 'idle',
          actions: assign(() => initialContext),
        },
      },
    },
  },
});
