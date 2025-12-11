import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';
import { toFile } from 'openai';

const json = NextResponse.json;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return json({ error: 'Missing audio file' }, { status: 400 });
    }

    const openai = getOpenAI();
    const file = await toFile(audioFile, 'audio.webm');

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });

    return json({ transcript: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
