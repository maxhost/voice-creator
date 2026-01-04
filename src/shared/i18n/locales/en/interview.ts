/**
 * English translations for Interview Page
 */
export const interview = {
  page: {
    greeting: 'Hello',
    paymentVerified: 'Payment verified',
    yourInterview: 'Your Interview',
  },
  states: {
    verifying: 'Verifying your payment...',
    verificationError: 'Verification error',
    verificationErrorMessage: "We couldn't verify your payment. Please try again.",
    backToHome: 'Back to home',
    sessionUsed: 'Session already used',
    sessionUsedMessage: 'This payment session has already been used for an interview.',
    buyNewSession: 'Buy new session',
    generating: 'Generating your ideas',
    generatingMessage: "We're analyzing your interview and creating personalized content ideas...",
  },
  panel: {
    languageHint: 'You can speak in any language and the AI will respond in that language',
    timeUp: 'Time is up. Please wait while we generate your ideas...',
    lastResponseWarning: 'Last chance to speak. The AI will give its final response.',
    status: {
      yourTurn: 'Your turn - Hold to speak',
      recording: 'Recording... Release to send',
      aiSpeaking: 'AI is speaking...',
      processing: 'Processing...',
    },
    instructions: 'Click and hold · Touch and hold · Or press spacebar',
  },
  onboarding: {
    title: 'Before we start...',
    subtitle: 'Tell us a bit about yourself to personalize your interview',
    nameLabel: 'Your name',
    namePlaceholder: "What's your name?",
    networksLabel: 'Which social networks do you want to create content for?',
    networksHint: 'Select at least one social network',
    expertiseLabel: 'What topics do you have expertise in or want to create content about?',
    expertisePlaceholder: 'E.g.: Digital marketing, productivity, personal development, cooking, fitness...',
    submit: 'Start interview',
  },
  payment: {
    title: 'Start Interview',
    earlyAccess: 'Early Access - One-time payment',
    features: {
      interview: '10-minute AI interview',
      ideas: 'Minimum 4 content ideas guaranteed',
      pdf: 'PDF download',
    },
    securePayment: 'Secure payment processed by Stripe',
  },
  transcript: {
    placeholder: 'The conversation will appear here',
    you: 'You',
    ai: 'AI',
  },
  thinking: 'Thinking...',
  recordButton: {
    recording: 'Recording...',
    processing: 'Processing...',
    holdToRecord: 'Hold to record',
  },
  micErrors: {
    denied: 'Microphone permission denied. Please enable it in your browser settings.',
    notFound: 'Could not access microphone. Please allow access in your browser.',
  },
};
