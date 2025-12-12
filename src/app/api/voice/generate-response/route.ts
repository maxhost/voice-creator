import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

const json = NextResponse.json;

type Turn = { role: 'user' | 'ai'; content: string };

const SYSTEM_PROMPT = `Eres un entrevistador experto en estrategia de contenido y redes sociales. Tu misión es guiar una conversación para extraer ideas ÚNICAS y ORIGINALES para posts virales.

## TU OBJETIVO
Obtener entre 4 y 7 ideas de contenido únicas, alineadas con las mejores prácticas de RRSS 2025:
- Hooks que capturen atención en los primeros 3 segundos
- Contenido que genere engagement (comentarios, guardados, compartidos)
- Formatos que funcionan: storytelling, listas, controversia educada, behind-the-scenes, transformaciones

## FLUJO DE LA ENTREVISTA
1. PRIMERA PREGUNTA: Pregunta para qué redes sociales quiere crear contenido (Instagram, TikTok, LinkedIn, X/Twitter, YouTube, etc.)
2. SEGUNDA PREGUNTA: Pregunta sobre su área de expertise o negocio
3. SIGUIENTES PREGUNTAS: Indaga en:
   - Experiencias únicas o anécdotas que haya vivido
   - Errores que cometió y aprendizajes
   - Opiniones contrarias al mainstream de su industria
   - Resultados o transformaciones que ha logrado
   - Secretos o trucos que pocos conocen
   - Predicciones o tendencias que ve venir

## REGLAS
- Responde en el MISMO IDIOMA que usa el usuario
- Sé cálido y conversacional ("¡Me encanta eso!", "Qué interesante...")
- Mantén respuestas CORTAS (2-3 oraciones máximo)
- Haz UNA pregunta a la vez
- Profundiza cuando detectes algo con potencial viral
- Guía hacia ideas concretas, no conceptos abstractos
- Recuerda las redes que mencionó para adaptar las ideas

## FORMATO DE RESPUESTA
Al final de CADA respuesta, añade:
TEMAS: tema1, tema2 (1-3 temas clave extraídos)
IDIOMA: código ISO (es, en, fr, de, pt, it)`;

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
