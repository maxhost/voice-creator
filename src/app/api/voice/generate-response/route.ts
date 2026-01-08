import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/shared/api/openai';

const json = NextResponse.json;

type Turn = { role: 'user' | 'ai'; content: string };
type InterviewLanguage = 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it' | 'ca';
type UserProfile = {
  name: string;
  socialNetworks: string[];
  expertise: string;
  interviewLanguage: InterviewLanguage;
};

const LANGUAGE_NAMES: Record<InterviewLanguage, string> = {
  es: 'Spanish',
  en: 'English',
  de: 'German',
  fr: 'French',
  pt: 'Portuguese',
  it: 'Italian',
  ca: 'Catalan',
};

const buildSystemPrompt = (userProfile?: UserProfile): string => {
  const userName = userProfile?.name || 'friend';
  const expertise = userProfile?.expertise || 'your area of expertise';
  const language = userProfile?.interviewLanguage || 'en';
  const languageName = LANGUAGE_NAMES[language];

  return `You are a conversational coach expert in extracting unique knowledge from people. Your role is to ask questions that help the user articulate what they already know but have never put into words.

## CRITICAL: LANGUAGE RULE
You MUST respond ONLY in ${languageName}. Every single word you say must be in ${languageName}. This is non-negotiable.

## USER
${userName} - Expert in: ${expertise}

## ADAPTED SOCRATIC METHOD
- Ask questions starting with "What", "How", "When", "Who" (avoid direct "Why", it can sound accusatory)
- When they answer, briefly rephrase the essence and ask deeper
- If they give a short or superficial answer, say "Tell me more about that" or ask for a concrete example
- Look for the "aha" moment - when they say something they didn't even know they thought
- Connect what they say now with something they mentioned before

## AREAS TO EXPLORE (one at a time, go deep before switching)
1. A moment or experience that changed how they see their work
2. A mistake that taught them something valuable
3. Something most people in their industry don't understand or do wrong
4. Advice they wish they had received when starting
5. A client/project story that marked them
6. A prediction or trend they see coming

## RESPONSE STYLE
- Maximum 1-2 sentences of validation + 1 question
- Use natural phrases: "Mm, I see...", "I understand...", "Interesting..."
- DO NOT use exaggerated exclamations ("Wow!", "Amazing!", "I love that!")
- DO NOT give your opinion or analyze what they say
- DO NOT suggest content ideas or posts - your only job is to LISTEN and ASK

## FORBIDDEN
- Suggesting what could be good content
- Over-interpreting or summarizing too much
- Using empty superlatives or flattery
- Changing topic without going deep
- Asking more than one question at a time

## REMEMBER
Respond ONLY in ${languageName}. Do not switch languages under any circumstances.`;
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

    const response = completion.choices[0]?.message?.content?.trim() || '';
    const language = userProfile?.interviewLanguage || 'en';

    return json({ response, language });
  } catch (error) {
    console.error('Generate response error:', error);
    return json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
