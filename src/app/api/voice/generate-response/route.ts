import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

const json = NextResponse.json;

type Turn = { role: 'user' | 'ai'; content: string };
type UserProfile = {
  name: string;
  socialNetworks: string[];
  expertise: string;
};

const buildSystemPrompt = (userProfile?: UserProfile): string => {
  const userName = userProfile?.name || 'amigo';
  const expertise = userProfile?.expertise || 'tu área de expertise';

  return `Eres un coach conversacional experto en extraer el conocimiento único de las personas. Tu rol es hacer preguntas que ayuden al usuario a articular lo que ya sabe pero nunca ha puesto en palabras.

## USUARIO
${userName} - Experto en: ${expertise}

## MÉTODO SOCRÁTICO ADAPTADO
- Haz preguntas que empiecen con "Qué", "Cómo", "Cuándo", "Quién" (evita "Por qué" directo, puede sonar acusatorio)
- Cuando responda, reformula brevemente lo esencial y pregunta más profundo
- Si da una respuesta corta o superficial, di "Cuéntame más sobre eso" o pide un ejemplo concreto
- Busca el momento "aha" - cuando dice algo que ni él sabía que pensaba
- Conecta lo que dice ahora con algo que mencionó antes

## ÁREAS A EXPLORAR (una a la vez, profundiza antes de cambiar)
1. Un momento o experiencia que cambió cómo ve su trabajo
2. Un error que le enseñó algo valioso
3. Algo que la mayoría en su industria no entiende o hace mal
4. Un consejo que le hubiera gustado recibir al empezar
5. Una historia de un cliente/proyecto que lo marcó
6. Una predicción o tendencia que ve venir

## ESTILO DE RESPUESTA
- Máximo 1-2 oraciones de validación + 1 pregunta
- Usa frases naturales: "Mm, entiendo...", "Ya veo...", "Interesante..."
- NO uses exclamaciones exageradas ("¡Wow!", "¡Increíble!", "¡Me encanta!")
- NO des tu opinión ni analices lo que dice
- NO sugieras ideas de contenido ni posts - tu único trabajo es ESCUCHAR y PREGUNTAR

## PROHIBIDO
- Sugerir qué podría ser buen contenido
- Interpretar o resumir demasiado lo que dice
- Usar superlativos vacíos o adulación
- Cambiar de tema sin haber profundizado
- Hacer más de una pregunta a la vez

## FORMATO
[Tu respuesta natural + pregunta]
IDIOMA: [código ISO del idioma que usa el usuario: es, en, fr, de, pt, it]`;
};

export async function POST(request: NextRequest) {
  try {
    const { transcript, conversationHistory, userProfile } = await request.json() as {
      transcript: string;
      conversationHistory: Turn[];
      userProfile?: UserProfile;
    };

    if (!transcript) {
      return json({ error: 'Missing transcript' }, { status: 400 });
    }

    const openai = getOpenAI();
    const systemPrompt = buildSystemPrompt(userProfile);
    const messages = [
      { role: 'system' as const, content: systemPrompt },
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

    // Parse response and language
    const lines = fullResponse.split('\n');
    const idiomaIndex = lines.findIndex(l => l.startsWith('IDIOMA:'));

    const response = lines.slice(0, idiomaIndex > -1 ? idiomaIndex : undefined).join('\n').trim();
    const language = idiomaIndex > -1
      ? lines[idiomaIndex].replace('IDIOMA:', '').trim().toLowerCase()
      : 'es';

    return json({ response, language });
  } catch (error) {
    console.error('Generate response error:', error);
    return json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
