import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

type UserProfile = {
  name: string;
  socialNetworks: string[];
  expertise: string;
};

const VOICE_BY_LANG: Record<string, 'nova' | 'onyx' | 'shimmer'> = {
  es: 'nova',
  en: 'onyx',
  fr: 'shimmer',
  de: 'onyx',
  pt: 'nova',
  it: 'shimmer',
};

const GREETING_TEMPLATES: Record<string, (profile: UserProfile) => string> = {
  es: (p) => `¡Hola ${p.name}! Qué gusto conocerte.
Vi que quieres crear contenido para ${formatNetworks(p.socialNetworks, 'es')} sobre ${p.expertise}.
¡Me encanta ese tema! Cuéntame, ¿qué es lo que más te apasiona de esto? ¿Qué te hace único en tu campo?`,

  en: (p) => `Hi ${p.name}! Great to meet you.
I see you want to create content for ${formatNetworks(p.socialNetworks, 'en')} about ${p.expertise}.
I love that topic! Tell me, what are you most passionate about? What makes you unique in your field?`,

  fr: (p) => `Bonjour ${p.name}! Ravi de vous rencontrer.
Je vois que vous voulez créer du contenu pour ${formatNetworks(p.socialNetworks, 'fr')} sur ${p.expertise}.
J'adore ce sujet! Dites-moi, qu'est-ce qui vous passionne le plus? Qu'est-ce qui vous rend unique dans votre domaine?`,

  de: (p) => `Hallo ${p.name}! Schön Sie kennenzulernen.
Ich sehe, Sie möchten Inhalte für ${formatNetworks(p.socialNetworks, 'de')} über ${p.expertise} erstellen.
Ich liebe dieses Thema! Erzählen Sie mir, was begeistert Sie am meisten? Was macht Sie einzigartig in Ihrem Bereich?`,

  pt: (p) => `Olá ${p.name}! Prazer em conhecê-lo.
Vejo que você quer criar conteúdo para ${formatNetworks(p.socialNetworks, 'pt')} sobre ${p.expertise}.
Adoro esse tema! Me conte, o que mais te apaixona nisso? O que te torna único na sua área?`,

  it: (p) => `Ciao ${p.name}! Piacere di conoscerti.
Vedo che vuoi creare contenuti per ${formatNetworks(p.socialNetworks, 'it')} su ${p.expertise}.
Adoro questo argomento! Dimmi, cosa ti appassiona di più? Cosa ti rende unico nel tuo campo?`,
};

const NETWORK_NAMES: Record<string, Record<string, string>> = {
  instagram: { es: 'Instagram', en: 'Instagram', fr: 'Instagram', de: 'Instagram', pt: 'Instagram', it: 'Instagram' },
  tiktok: { es: 'TikTok', en: 'TikTok', fr: 'TikTok', de: 'TikTok', pt: 'TikTok', it: 'TikTok' },
  linkedin: { es: 'LinkedIn', en: 'LinkedIn', fr: 'LinkedIn', de: 'LinkedIn', pt: 'LinkedIn', it: 'LinkedIn' },
  twitter: { es: 'X', en: 'X', fr: 'X', de: 'X', pt: 'X', it: 'X' },
  youtube: { es: 'YouTube', en: 'YouTube', fr: 'YouTube', de: 'YouTube', pt: 'YouTube', it: 'YouTube' },
  facebook: { es: 'Facebook', en: 'Facebook', fr: 'Facebook', de: 'Facebook', pt: 'Facebook', it: 'Facebook' },
};

const CONJUNCTIONS: Record<string, string> = {
  es: ' y ', en: ' and ', fr: ' et ', de: ' und ', pt: ' e ', it: ' e ',
};

function formatNetworks(networks: string[], lang: string): string {
  const names = networks.map((n) => NETWORK_NAMES[n]?.[lang] || n);
  if (names.length === 1) return names[0];
  const conj = CONJUNCTIONS[lang] || ' and ';
  return names.slice(0, -1).join(', ') + conj + names[names.length - 1];
}

function getLanguageFromCode(code: string): string {
  const lang = code.split('-')[0].toLowerCase();
  return GREETING_TEMPLATES[lang] ? lang : 'en';
}

async function detectLanguage(text: string, openai: ReturnType<typeof getOpenAI>): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Detect the language of the text. Respond with ONLY the ISO 639-1 code (es, en, fr, de, pt, it). If unsure, respond with "en".',
        },
        { role: 'user', content: text },
      ],
      max_tokens: 5,
      temperature: 0,
    });
    const detected = response.choices[0]?.message?.content?.trim().toLowerCase() || 'en';
    return GREETING_TEMPLATES[detected] ? detected : 'en';
  } catch {
    return 'en';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile } = body as { userProfile: UserProfile };

    if (!userProfile?.name || !userProfile?.socialNetworks?.length || !userProfile?.expertise) {
      return NextResponse.json({ error: 'Invalid user profile' }, { status: 400 });
    }

    const openai = getOpenAI();

    // Detect language from the expertise text
    const lang = await detectLanguage(userProfile.expertise, openai);
    const greetingText = GREETING_TEMPLATES[lang](userProfile);
    const voice = VOICE_BY_LANG[lang] || 'nova';

    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: greetingText,
    });

    const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'X-Greeting-Text': encodeURIComponent(greetingText),
        'X-Language': lang,
      },
    });
  } catch (error) {
    console.error('Greeting TTS error:', error);
    return NextResponse.json({ error: 'Failed to generate greeting' }, { status: 500 });
  }
}
