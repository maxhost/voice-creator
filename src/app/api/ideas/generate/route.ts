import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';
import type { Post } from '@/entities/post';

const json = NextResponse.json;

type Turn = { speaker: 'user' | 'ai'; transcript: string };
type UserProfile = {
  name: string;
  socialNetworks: string[];
  expertise: string;
};

const PLATFORM_FORMATS: Record<string, { formats: string[]; description: string }> = {
  tiktok: {
    formats: ['video', 'reel'],
    description: 'Videos verticales cortos (15-60 seg) o reels (hasta 3 min)',
  },
  instagram: {
    formats: ['carousel', 'reel', 'story', 'video'],
    description: 'Carruseles (posts con múltiples imágenes), reels, stories o videos',
  },
  twitter: {
    formats: ['text', 'thread'],
    description: 'Tweets individuales o hilos (threads) de múltiples tweets',
  },
  linkedin: {
    formats: ['text', 'carousel', 'video'],
    description: 'Posts de texto, carruseles PDF/imágenes o videos',
  },
  youtube: {
    formats: ['video'],
    description: 'Videos largos o cortos (Shorts)',
  },
  facebook: {
    formats: ['text', 'video', 'story', 'reel'],
    description: 'Posts de texto, videos, stories o reels',
  },
};

function buildSystemPrompt(socialNetworks: string[]): string {
  const platformRules = socialNetworks
    .map((network) => {
      const config = PLATFORM_FORMATS[network.toLowerCase()];
      if (!config) return null;
      return `- ${network}: Solo usar formatos [${config.formats.join(', ')}]. ${config.description}`;
    })
    .filter(Boolean)
    .join('\n');

  return `Eres un experto en estrategia de contenido para redes sociales.
Tu tarea es analizar una conversación/entrevista y extraer ideas ÚNICAS y ORIGINALES para posts.

## REGLAS
1. Genera entre 4 y 7 ideas de contenido
2. Cada idea debe ser ÚNICA y diferente a las demás
3. Basa las ideas en lo que el usuario REALMENTE dijo (experiencias, opiniones, conocimientos)
4. Los títulos deben ser hooks que capturen atención
5. Las descripciones deben explicar brevemente el contenido del post

## FORMATOS POR PLATAFORMA (MUY IMPORTANTE)
${platformRules}

NUNCA sugieras un formato que no sea compatible con la plataforma indicada.
Por ejemplo: NO uses "thread" para TikTok, NO uses "reel" para Twitter.

## FORMATO DE RESPUESTA (JSON)
Responde ÚNICAMENTE con un array JSON válido, sin texto adicional:
[
  {
    "title": "Título/Hook del post",
    "description": "Breve descripción de qué trata el post (2-3 oraciones)",
    "platform": "instagram|tiktok|linkedin|twitter|youtube",
    "contentType": "text|carousel|video|thread|story|reel",
    "keyPoints": ["punto clave 1", "punto clave 2"],
    "suggestedHooks": ["hook alternativo 1", "hook alternativo 2"]
  }
]`;
}

function buildUserPrompt(turns: Turn[], userProfile: UserProfile): string {
  const conversation = turns
    .map((t) => `${t.speaker === 'user' ? 'Usuario' : 'Entrevistador'}: ${t.transcript}`)
    .join('\n\n');

  return `## PERFIL DEL USUARIO
- Nombre: ${userProfile.name}
- Redes objetivo: ${userProfile.socialNetworks.join(', ')}
- Área de expertise: ${userProfile.expertise}

## CONVERSACIÓN DE LA ENTREVISTA
${conversation}

## INSTRUCCIONES
Analiza la conversación y genera ideas de contenido para las redes: ${userProfile.socialNetworks.join(', ')}.
Enfócate en las experiencias, opiniones y conocimientos únicos que compartió el usuario.
Responde SOLO con el JSON, sin explicaciones adicionales.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { turns, userProfile } = body as {
      turns: Turn[];
      userProfile: UserProfile;
    };

    if (!turns?.length || !userProfile) {
      return json({ error: 'Missing turns or userProfile' }, { status: 400 });
    }

    const openai = getOpenAI();
    const systemPrompt = buildSystemPrompt(userProfile.socialNetworks);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt(turns, userProfile) },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '[]';

    // Parse JSON response
    let ideas: Array<{
      title: string;
      description: string;
      platform: string;
      contentType: string;
      keyPoints: string[];
      suggestedHooks: string[];
    }>;

    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      ideas = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error('Failed to parse ideas JSON:', content);
      ideas = [];
    }

    // Transform to Post type
    const posts: Post[] = ideas.map((idea, index) => ({
      id: `post-${Date.now()}-${index}`,
      title: idea.title,
      description: idea.description,
      platform: idea.platform as Post['platform'],
      contentType: (idea.contentType || 'text') as Post['contentType'],
      basedOnInsightId: '',
      suggestedHooks: idea.suggestedHooks || [],
      keyPoints: idea.keyPoints || [],
      estimatedEngagement: 'medium' as const,
    }));

    return json({ posts });
  } catch (error) {
    console.error('Generate ideas error:', error);
    return json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
