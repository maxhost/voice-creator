import { NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

const GREETING_TEXT = `¡Hola! Bienvenido a tu sesión de creación de contenido.
Soy tu entrevistador y voy a ayudarte a descubrir ideas únicas para tus redes sociales.
Para empezar, cuéntame: ¿Para qué redes sociales te gustaría crear contenido?
¿Instagram, TikTok, LinkedIn, YouTube, o alguna otra?`;

export async function GET() {
  try {
    const openai = getOpenAI();

    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: GREETING_TEXT,
    });

    const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': audioBuffer.length.toString() },
    });
  } catch (error) {
    console.error('Greeting TTS error:', error);
    return NextResponse.json({ error: 'Failed to generate greeting' }, { status: 500 });
  }
}

// Also export the text for the transcript
export async function POST() {
  return NextResponse.json({
    greeting: GREETING_TEXT,
    language: 'es'
  });
}
