# Voice Creator - Data Flow Documentation

## Overview

Este documento describe cómo fluye la información a través de la aplicación, siguiendo el paradigma FRP con State Machines.

---

## 1. Flujo Principal de la Aplicación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           APP STATE MACHINE                              │
│                                                                          │
│  ┌──────┐   ┌─────────┐   ┌───────────┐   ┌──────────┐   ┌─────────┐  │
│  │ IDLE │──▶│ PAYING  │──▶│INTERVIEWING│──▶│GENERATING│──▶│ RESULTS │  │
│  └──────┘   └─────────┘   └───────────┘   └──────────┘   └─────────┘  │
│      │           │              │               │              │        │
│      ▼           ▼              ▼               ▼              ▼        │
│  Landing    Payment Modal   Interview UI   Loading UI    Results UI    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Flujo de Pago (Payment Flow)

### Secuencia

```
Usuario                   App                    Stripe                Server
   │                       │                       │                      │
   │──Click CTA───────────▶│                       │                      │
   │                       │──Create Session──────▶│                      │
   │                       │◀─Session URL──────────│                      │
   │◀──Redirect────────────│                       │                      │
   │                       │                       │                      │
   │──────────────────────Complete Payment────────▶│                      │
   │                       │                       │──Webhook────────────▶│
   │                       │                       │                      │
   │                       │◀────────────────────────Payment Confirmed────│
   │◀──Redirect to /interview──────────────────────│                      │
```

### Datos que Fluyen

```typescript
// 1. Crear sesión de pago
type CreateSessionInput = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
};

// 2. Webhook recibido
type StripeWebhookPayload = {
  type: 'checkout.session.completed';
  data: {
    object: {
      id: string;
      payment_intent: string;
      customer_email: string;
    };
  };
};

// 3. Estado actualizado
type PaymentConfirmedEvent = {
  type: 'PAYMENT_SUCCESS';
  sessionId: string;
  paymentIntentId: string;
};
```

---

## 3. Flujo de Entrevista (Interview Loop)

### Diagrama de Secuencia

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│  Usuario  │     │   App     │     │ Whisper   │     │  GPT-4    │
└─────┬─────┘     └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
      │                 │                 │                 │
      │ Press Record    │                 │                 │
      │────────────────▶│                 │                 │
      │                 │                 │                 │
      │ [Recording...]  │                 │                 │
      │                 │                 │                 │
      │ Release Record  │                 │                 │
      │────────────────▶│                 │                 │
      │                 │                 │                 │
      │                 │ Play Filler     │                 │
      │◀────────────────│                 │                 │
      │                 │                 │                 │
      │                 │ Transcribe      │                 │
      │                 │────────────────▶│                 │
      │                 │                 │                 │
      │                 │◀───Transcript───│                 │
      │                 │                 │                 │
      │                 │ Generate Response                 │
      │                 │────────────────────────────────▶  │
      │                 │                                   │
      │                 │◀──────────Response────────────────│
      │                 │                 │                 │
      │                 │                 │                 │
┌─────┴─────┐     ┌─────┴─────┐     ┌─────┴─────┐     ┌─────┴─────┐
│ElevenLabs │     │   App     │     │  Usuario  │     │  Context  │
└─────┬─────┘     └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
      │                 │                 │                 │
      │◀───TTS Request──│                 │                 │
      │                 │                 │                 │
      │───Audio Stream─▶│                 │                 │
      │                 │                 │                 │
      │                 │───Play Audio───▶│                 │
      │                 │                 │                 │
      │                 │───Update Context────────────────▶ │
      │                 │                 │                 │
      │                 │                 │                 │
      └─────────────────┴─────────────────┴─────────────────┘
                              │
                              ▼
                    [Loop hasta TIMER_END]
```

### Estructura del Context Accumulator

```typescript
type InterviewContext = {
  sessionId: string;
  startedAt: number;
  timeRemaining: number; // segundos

  turns: Turn[];
  extractedTopics: Topic[];
  insights: Insight[];

  metadata: {
    totalUserWords: number;
    totalAiWords: number;
    dominantThemes: string[];
  };
};

type Turn = {
  id: string;
  speaker: 'user' | 'ai';
  transcript: string;
  timestamp: number;
  audioUrl?: string; // Para replay opcional
  extractedTopics: string[]; // Temas de este turno específico
};

type Topic = {
  id: string;
  name: string;
  relevanceScore: number; // 0-1
  mentionCount: number;
  firstMentionedAt: number;
  relatedTurns: string[]; // Turn IDs
};

type Insight = {
  id: string;
  type: 'pain_point' | 'success_story' | 'opinion' | 'experience';
  content: string;
  sourceTurnId: string;
};
```

### Flujo de Datos en el Loop

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERVIEW CONTEXT                         │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  turns   │───▶│  topics  │───▶│ insights │              │
│  │   []     │    │    []    │    │    []    │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│       ▲               ▲               ▲                     │
│       │               │               │                     │
│  ┌────┴────┐    ┌────┴────┐    ┌────┴────┐                │
│  │ addTurn │    │ extract │    │ analyze │                 │
│  │   ()    │    │Topics() │    │Insight()│                 │
│  └─────────┘    └─────────┘    └─────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │   buildNextPrompt   │
              │        ()           │
              └─────────────────────┘
```

---

## 4. Flujo de Generación de Posts

### Input → Processing → Output

```
┌─────────────────────────────────────────────────────────────────────┐
│                        POST GENERATION                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  INPUT                                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ InterviewContext                                             │   │
│  │  - turns: Turn[]           (toda la conversación)           │   │
│  │  - extractedTopics: Topic[] (temas rankeados)               │   │
│  │  - insights: Insight[]      (puntos clave identificados)    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  PROCESSING                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ GPT-4 Prompt:                                                │   │
│  │                                                              │   │
│  │ "Basado en esta entrevista, genera 4-7 ideas de posts       │   │
│  │  para redes sociales. Cada post debe:                       │   │
│  │  - Tener un título llamativo                                │   │
│  │  - Describir el contenido potencial                         │   │
│  │  - Indicar la plataforma ideal (LinkedIn, Twitter, etc)     │   │
│  │  - Basarse en los insights reales de la entrevista"         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  OUTPUT                                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Post[]                                                       │   │
│  │  [                                                          │   │
│  │    {                                                        │   │
│  │      id: "post-1",                                         │   │
│  │      title: "5 errores que cometí...",                     │   │
│  │      description: "Basado en tu experiencia con...",       │   │
│  │      platform: "linkedin",                                 │   │
│  │      contentType: "carousel",                              │   │
│  │      basedOnInsight: "insight-3",                          │   │
│  │      estimatedEngagement: "high"                           │   │
│  │    },                                                       │   │
│  │    ...                                                      │   │
│  │  ]                                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Tipo de Post

```typescript
type Post = {
  id: string;
  title: string;
  description: string;
  platform: 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  contentType: 'text' | 'carousel' | 'video' | 'thread' | 'story';
  basedOnInsight: string; // Insight ID que originó esta idea
  suggestedHooks: string[]; // 2-3 hooks alternativos
  keyPoints: string[]; // Puntos a cubrir en el post
  estimatedEngagement: 'low' | 'medium' | 'high';
};
```

---

## 5. Flujo de Exportación PDF

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Post[]       │────▶│  PDF Template   │────▶│   Blob (PDF)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │   Download      │
                                                │   (Browser)     │
                                                └─────────────────┘
```

### Contenido del PDF

```typescript
type PdfContent = {
  header: {
    title: 'Tus Ideas de Contenido';
    generatedAt: Date;
    interviewDuration: string;
  };

  summary: {
    totalPosts: number;
    topicsDiscussed: string[];
    platforms: string[];
  };

  posts: Array<{
    number: number;
    title: string;
    platform: string;
    description: string;
    keyPoints: string[];
  }>;

  footer: {
    brandingText: string;
    websiteUrl: string;
  };
};
```

---

## 6. Estado Global (XState Context)

### Estructura Completa

```typescript
type AppMachineContext = {
  // Session
  sessionId: string | null;

  // Payment
  payment: {
    status: 'idle' | 'pending' | 'confirmed' | 'failed';
    intentId: string | null;
    error: string | null;
  };

  // Interview
  interview: {
    context: InterviewContext | null;
    status: 'idle' | 'recording' | 'processing' | 'playing' | 'waiting';
    timeRemaining: number;
    currentTurnId: string | null;
  };

  // Generation
  generation: {
    status: 'idle' | 'generating' | 'complete' | 'failed';
    progress: number; // 0-100
    posts: Post[];
  };

  // UI
  ui: {
    error: AppError | null;
    isLoading: boolean;
  };
};
```

### Eventos que Modifican el Estado

```typescript
type AppMachineEvents =
  // Payment
  | { type: 'INIT_PAYMENT' }
  | { type: 'PAYMENT_SUCCESS'; intentId: string }
  | { type: 'PAYMENT_FAILED'; error: string }

  // Interview
  | { type: 'START_INTERVIEW' }
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING'; audioBlob: Blob }
  | { type: 'TRANSCRIPTION_COMPLETE'; transcript: string }
  | { type: 'AI_RESPONSE_READY'; response: string; audio: Blob }
  | { type: 'AI_AUDIO_COMPLETE' }
  | { type: 'TIMER_TICK' }
  | { type: 'TIMER_END' }
  | { type: 'FINAL_RESPONSE_COMPLETE' }

  // Generation
  | { type: 'START_GENERATION' }
  | { type: 'GENERATION_PROGRESS'; progress: number }
  | { type: 'GENERATION_COMPLETE'; posts: Post[] }
  | { type: 'GENERATION_FAILED'; error: string }

  // General
  | { type: 'RESET' }
  | { type: 'SET_ERROR'; error: AppError };
```

---

## 7. Comunicación entre Features

### Regla: Via Widget o State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                        WIDGET LAYER                          │
│                   (Orquesta features)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐          ┌─────────────┐                  │
│   │   Feature   │◀────────▶│   Feature   │   ❌ PROHIBIDO   │
│   │      A      │          │      B      │                  │
│   └─────────────┘          └─────────────┘                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐          ┌─────────────┐                  │
│   │   Feature   │          │   Feature   │                  │
│   │      A      │          │      B      │                  │
│   └──────┬──────┘          └──────┬──────┘                  │
│          │                        │                         │
│          └────────┬───────────────┘                         │
│                   │                                         │
│                   ▼                                         │
│          ┌─────────────┐                                    │
│          │   Widget    │         ✅ CORRECTO                │
│          │(Orchestrator)│                                    │
│          └─────────────┘                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo Concreto

```typescript
// widgets/interview-panel/ui/InterviewPanel.tsx

import { RecordButton, useAudioRecording } from '@/features/voice-interview';
import { useTopicExtraction } from '@/features/topic-extraction';
import { useAppMachine } from '@/app/providers';

export const InterviewPanel = () => {
  const { send, state } = useAppMachine();
  const { startRecording, stopRecording, audioBlob } = useAudioRecording();
  const { extractTopics } = useTopicExtraction();

  // Widget orquesta la comunicación
  const handleRecordingComplete = async () => {
    const blob = await stopRecording();

    // Evento a la state machine
    send({ type: 'STOP_RECORDING', audioBlob: blob });
  };

  // Reaccionar a cambios de estado
  useEffect(() => {
    if (state.matches('interview.transcriptionComplete')) {
      const transcript = state.context.interview.currentTranscript;
      extractTopics(transcript); // Feature B recibe datos
    }
  }, [state]);

  return (
    <RecordButton
      onStart={startRecording}
      onStop={handleRecordingComplete}
    />
  );
};
```

---

## 8. Persistencia de Datos

### Qué se Persiste y Dónde

| Dato | Storage | Razón |
|------|---------|-------|
| Session ID | URL param + sessionStorage | Sobrevive refresh |
| Payment Status | Server (via webhook) | Source of truth |
| Interview Context | Memory (XState) | No necesita persistir |
| Generated Posts | Memory → PDF | Usuario descarga |

### No se Persiste

- Audio grabado (procesado y descartado)
- Transcripciones intermedias
- Estado de UI

### Flow de Recuperación (si refresh durante entrevista)

```
1. Usuario hace refresh
2. App lee sessionId de URL
3. Consulta servidor: ¿sesión válida?
4. Si pagó pero no completó → redirigir a /interview (timer reinicia)
5. Si completó → redirigir a /results (regenerar posts)
6. Si no pagó → redirigir a /
```

**Nota MVP**: Para simplificar, si el usuario hace refresh durante la entrevista, pierde el progreso. Esto es aceptable para MVP.
