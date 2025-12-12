import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

const GREETINGS: Record<string, { text: string; voice: string }> = {
  es: {
    text: `¡Hola! Bienvenido a tu sesión de creación de contenido.
Soy tu entrevistador y voy a ayudarte a descubrir ideas únicas para tus redes sociales.
Para empezar, cuéntame: ¿Para qué redes sociales te gustaría crear contenido?
¿Instagram, TikTok, LinkedIn, YouTube, o alguna otra?`,
    voice: 'nova',
  },
  en: {
    text: `Hi! Welcome to your content creation session.
I'm your interviewer and I'll help you discover unique ideas for your social media.
To start, tell me: Which social networks would you like to create content for?
Instagram, TikTok, LinkedIn, YouTube, or any other?`,
    voice: 'onyx',
  },
  fr: {
    text: `Bonjour! Bienvenue dans votre session de création de contenu.
Je suis votre intervieweur et je vais vous aider à découvrir des idées uniques pour vos réseaux sociaux.
Pour commencer, dites-moi: Pour quels réseaux sociaux souhaitez-vous créer du contenu?
Instagram, TikTok, LinkedIn, YouTube, ou autre?`,
    voice: 'shimmer',
  },
  de: {
    text: `Hallo! Willkommen zu Ihrer Content-Erstellungs-Session.
Ich bin Ihr Interviewer und werde Ihnen helfen, einzigartige Ideen für Ihre sozialen Medien zu entdecken.
Um zu beginnen, sagen Sie mir: Für welche sozialen Netzwerke möchten Sie Inhalte erstellen?
Instagram, TikTok, LinkedIn, YouTube oder andere?`,
    voice: 'onyx',
  },
  pt: {
    text: `Olá! Bem-vindo à sua sessão de criação de conteúdo.
Sou seu entrevistador e vou ajudá-lo a descobrir ideias únicas para suas redes sociais.
Para começar, me conte: Para quais redes sociais você gostaria de criar conteúdo?
Instagram, TikTok, LinkedIn, YouTube ou outra?`,
    voice: 'nova',
  },
  it: {
    text: `Ciao! Benvenuto nella tua sessione di creazione di contenuti.
Sono il tuo intervistatore e ti aiuterò a scoprire idee uniche per i tuoi social media.
Per iniziare, dimmi: Per quali social network vorresti creare contenuti?
Instagram, TikTok, LinkedIn, YouTube o altri?`,
    voice: 'shimmer',
  },
};

const DEFAULT_LANG = 'en';

function getLanguageFromCode(code: string): string {
  const lang = code.split('-')[0].toLowerCase();
  return GREETINGS[lang] ? lang : DEFAULT_LANG;
}

export async function GET(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') || DEFAULT_LANG;
    const normalizedLang = getLanguageFromCode(lang);
    const { text, voice } = GREETINGS[normalizedLang];

    const openai = getOpenAI();
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as 'nova' | 'onyx' | 'shimmer',
      input: text,
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

export async function POST(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang') || DEFAULT_LANG;
  const normalizedLang = getLanguageFromCode(lang);
  const { text } = GREETINGS[normalizedLang];

  return NextResponse.json({ greeting: text, language: normalizedLang });
}
