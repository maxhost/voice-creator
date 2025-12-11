/**
 * Environment variables with runtime validation.
 * All env vars should be accessed through this module.
 */

const getEnvVar = (key: string, required = true): string => {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value ?? '';
};

export const env = {
  // OpenAI
  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY'),

  // ElevenLabs
  ELEVENLABS_API_KEY: getEnvVar('ELEVENLABS_API_KEY'),
  ELEVENLABS_VOICE_ID: getEnvVar('ELEVENLABS_VOICE_ID', false) || 'default',

  // Stripe
  STRIPE_SECRET_KEY: getEnvVar('STRIPE_SECRET_KEY'),
  STRIPE_PUBLISHABLE_KEY: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  STRIPE_PRICE_ID: getEnvVar('STRIPE_PRICE_ID'),

  // App
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',

  // Feature flags
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;
