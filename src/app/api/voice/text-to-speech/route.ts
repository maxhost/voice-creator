import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

// OpenAI TTS voices - no concurrency limits
const VOICE_BY_LANGUAGE: Record<string, string> = {
  es: 'nova',    // Warm female, great for Spanish
  en: 'onyx',    // Deep male, natural English
  fr: 'shimmer', // Soft female, good for French
  de: 'onyx',    // Deep male, works for German
  pt: 'nova',    // Warm female, good for Portuguese
  it: 'shimmer', // Soft female, good for Italian
};

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json() as { text: string; language?: string };

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const openai = getOpenAI();
    const voice = (language && VOICE_BY_LANGUAGE[language]) || 'nova';

    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as 'nova' | 'onyx' | 'shimmer' | 'alloy' | 'echo' | 'fable',
      input: text,
    });

    const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': audioBuffer.length.toString() },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
