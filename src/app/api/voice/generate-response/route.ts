import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

const json = NextResponse.json;

type Turn = { role: 'user' | 'ai'; content: string };

const SYSTEM_PROMPT = `Eres un entrevistador amigable y conversacional para creadores de contenido.
Tu objetivo es ayudar a extraer ideas interesantes para posts de redes sociales.

Reglas:
- Responde en el MISMO IDIOMA que usa el usuario
- Sé cálido, haz comentarios sobre lo que dice ("¡Qué interesante!", "Me encanta eso")
- Haz preguntas de seguimiento basadas en lo que el usuario comparte
- Mantén respuestas cortas (2-3 oraciones máximo)
- Si detectas un tema interesante, profundiza en él
- Guía la conversación hacia ideas que puedan convertirse en contenido

Al final de tu respuesta, añade dos líneas:
1. "TEMAS:" seguida de 1-3 temas clave separados por comas
2. "IDIOMA:" seguido del código ISO del idioma (es, en, fr, de, pt, it)`;

export async function POST(request: NextRequest) {
  try {
    const { transcript, conversationHistory } = await request.json() as {
      transcript: string;
      conversationHistory: Turn[];
    };

    if (!transcript) {
      return json({ error: 'Missing transcript' }, { status: 400 });
    }

    const openai = getOpenAI();
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...conversationHistory.map((turn) => ({
        role: turn.role === 'user' ? 'user' as const : 'assistant' as const,
        content: turn.content,
      })),
      { role: 'user' as const, content: transcript },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const fullResponse = completion.choices[0]?.message?.content || '';

    // Parse response, topics, and language
    const lines = fullResponse.split('\n');
    const temasIndex = lines.findIndex(l => l.startsWith('TEMAS:'));
    const idiomaIndex = lines.findIndex(l => l.startsWith('IDIOMA:'));

    const response = lines.slice(0, temasIndex > -1 ? temasIndex : undefined).join('\n').trim();
    const topics = temasIndex > -1
      ? lines[temasIndex].replace('TEMAS:', '').split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const language = idiomaIndex > -1
      ? lines[idiomaIndex].replace('IDIOMA:', '').trim().toLowerCase()
      : 'es';

    return json({ response, topics, language });
  } catch (error) {
    console.error('Generate response error:', error);
    return json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
