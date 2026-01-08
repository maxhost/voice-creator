import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

type InterviewLanguage = 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it' | 'ca';

type UserProfile = {
  name: string;
  socialNetworks: string[];
  expertise: string;
  interviewLanguage: InterviewLanguage;
};

const VOICE_BY_LANG: Record<string, 'nova' | 'onyx' | 'shimmer'> = {
  es: 'nova',
  en: 'onyx',
  fr: 'shimmer',
  de: 'onyx',
  pt: 'nova',
  it: 'shimmer',
  ca: 'nova',
};

const GREETING_TEMPLATES: Record<string, (profile: UserProfile) => string> = {
  es: (p) => `Hola ${p.name}, qué tal. Vi que trabajas en ${p.expertise} y quieres crear contenido para ${formatNetworks(p.socialNetworks, 'es')}. Cuéntame, ¿cómo llegaste a dedicarte a esto?`,

  en: (p) => `Hi ${p.name}. I see you work in ${p.expertise} and want to create content for ${formatNetworks(p.socialNetworks, 'en')}. Tell me, how did you get into this field?`,

  fr: (p) => `Bonjour ${p.name}. Je vois que vous travaillez dans ${p.expertise} et souhaitez créer du contenu pour ${formatNetworks(p.socialNetworks, 'fr')}. Dites-moi, comment êtes-vous arrivé dans ce domaine?`,

  de: (p) => `Hallo ${p.name}. Ich sehe, Sie arbeiten im Bereich ${p.expertise} und möchten Inhalte für ${formatNetworks(p.socialNetworks, 'de')} erstellen. Erzählen Sie mir, wie sind Sie zu diesem Bereich gekommen?`,

  pt: (p) => `Olá ${p.name}. Vejo que você trabalha com ${p.expertise} e quer criar conteúdo para ${formatNetworks(p.socialNetworks, 'pt')}. Me conta, como você chegou nessa área?`,

  it: (p) => `Ciao ${p.name}. Vedo che lavori in ${p.expertise} e vuoi creare contenuti per ${formatNetworks(p.socialNetworks, 'it')}. Dimmi, come sei arrivato in questo campo?`,

  ca: (p) => `Hola ${p.name}. Veig que treballes en ${p.expertise} i vols crear contingut per a ${formatNetworks(p.socialNetworks, 'ca')}. Explica'm, com vas arribar a dedicar-te a això?`,
};

const NETWORK_NAMES: Record<string, Record<string, string>> = {
  instagram: { es: 'Instagram', en: 'Instagram', fr: 'Instagram', de: 'Instagram', pt: 'Instagram', it: 'Instagram', ca: 'Instagram' },
  tiktok: { es: 'TikTok', en: 'TikTok', fr: 'TikTok', de: 'TikTok', pt: 'TikTok', it: 'TikTok', ca: 'TikTok' },
  linkedin: { es: 'LinkedIn', en: 'LinkedIn', fr: 'LinkedIn', de: 'LinkedIn', pt: 'LinkedIn', it: 'LinkedIn', ca: 'LinkedIn' },
  twitter: { es: 'X', en: 'X', fr: 'X', de: 'X', pt: 'X', it: 'X', ca: 'X' },
  youtube: { es: 'YouTube', en: 'YouTube', fr: 'YouTube', de: 'YouTube', pt: 'YouTube', it: 'YouTube', ca: 'YouTube' },
  facebook: { es: 'Facebook', en: 'Facebook', fr: 'Facebook', de: 'Facebook', pt: 'Facebook', it: 'Facebook', ca: 'Facebook' },
};

const CONJUNCTIONS: Record<string, string> = {
  es: ' y ', en: ' and ', fr: ' et ', de: ' und ', pt: ' e ', it: ' e ', ca: ' i ',
};

function formatNetworks(networks: string[], lang: string): string {
  const names = networks.map((n) => NETWORK_NAMES[n]?.[lang] || n);
  if (names.length === 1) return names[0];
  const conj = CONJUNCTIONS[lang] || ' and ';
  return names.slice(0, -1).join(', ') + conj + names[names.length - 1];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile } = body as { userProfile: UserProfile };

    if (!userProfile?.name || !userProfile?.socialNetworks?.length || !userProfile?.expertise) {
      return NextResponse.json({ error: 'Invalid user profile' }, { status: 400 });
    }

    const openai = getOpenAI();

    // Use the interview language selected by user
    const lang = userProfile.interviewLanguage || 'en';
    const greetingTemplate = GREETING_TEMPLATES[lang] || GREETING_TEMPLATES['en'];
    const greetingText = greetingTemplate(userProfile);
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
