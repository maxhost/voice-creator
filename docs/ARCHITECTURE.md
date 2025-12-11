# Voice Creator - Architecture Documentation

## Overview

Voice Creator es una aplicación de entrevistas por voz con IA que genera ideas de contenido para redes sociales. La arquitectura está diseñada bajo el paradigma **Functional Reactive Programming (FRP)** con **State Machines**, implementada sobre **Feature-Sliced Design (FSD)**.

---

## Paradigma: FRP + State Machines

### Por qué este paradigma

1. **Flujo de estados discretos**: La app tiene transiciones claras y predecibles
2. **Streams de datos**: El audio es inherentemente un flujo reactivo
3. **Efectos secundarios controlados**: Pagos, API calls, síntesis de voz
4. **Transiciones ilegales prevenidas**: No puedes saltar de Landing a Results

### Estados de la Aplicación

```
┌─────────┐     ┌─────────────────┐     ┌───────────────────┐
│  IDLE   │────▶│ PAYMENT_PENDING │────▶│ PAYMENT_CONFIRMED │
└─────────┘     └─────────────────┘     └───────────────────┘
                        │                         │
                        ▼                         ▼
                   [FAILED]               ┌───────────────────┐
                        │                 │ INTERVIEW_ACTIVE  │
                        ▼                 └───────────────────┘
                   ┌─────────┐                    │
                   │  IDLE   │                    ▼
                   └─────────┘            ┌───────────────────┐
                                          │ INTERVIEW_CLOSING │
                                          └───────────────────┘
                                                  │
                                                  ▼
                                          ┌───────────────────┐
                                          │    GENERATING     │
                                          └───────────────────┘
                                                  │
                                                  ▼
                                          ┌───────────────────┐
                                          │     RESULTS       │
                                          └───────────────────┘
```

---

## Stack Técnico

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Framework | Next.js 14+ (App Router) | SSR landing, CSR interview |
| State Machine | XState v5 | Manejo de estados complejos |
| Reactivity | RxJS | Streams de audio |
| STT | OpenAI Whisper | Precisión en español/inglés |
| LLM | GPT-4 | Calidad de respuestas |
| TTS | ElevenLabs | Voces naturales |
| Pagos | Stripe Checkout | Simplicidad, seguridad |
| PDF | @react-pdf/renderer | Generación client-side |
| Styling | Tailwind CSS | Rapid prototyping |
| Animations | Framer Motion | Feedback visual para voice UI |

---

## Feature-Sliced Design (FSD) Adaptado

### Estructura de Capas

```
src/
├── app/              # Capa de aplicación (providers, routing, estilos globales)
├── views/            # Composiciones de UI por página (renombrado de "pages" para evitar conflicto con Next.js)
├── widgets/          # Bloques de UI complejos (composición de features)
├── features/         # Funcionalidades de negocio (slices independientes)
├── entities/         # Entidades de dominio (Post, InterviewSession)
└── shared/           # Código compartido (api clients, utils, ui primitivos)
```

> **Nota**: En FSD tradicional esta capa se llama "pages", pero usamos "views" para evitar conflicto con el Pages Router de Next.js.

### Regla de Dependencias (Import Rule)

```
app → views → widgets → features → entities → shared
 ▲                                              │
 └──────────────────────────────────────────────┘
              NUNCA en dirección contraria
```

**Válido:**
```typescript
// features/payment/ui/PaymentButton.tsx
import { Button } from '@/shared/ui';
import { Post } from '@/entities/post';
```

**Inválido:**
```typescript
// shared/ui/Button.tsx
import { usePayment } from '@/features/payment'; // ❌ PROHIBIDO
```

### Estructura de un Feature Slice

```
features/
└── voice-interview/
    ├── api/           # Llamadas a servicios externos
    │   ├── whisper.ts         # STT service
    │   ├── openai.ts          # LLM service
    │   └── elevenlabs.ts      # TTS service
    ├── model/         # Estado, lógica de negocio, state machines
    │   ├── interview.machine.ts
    │   ├── audio.stream.ts
    │   └── types.ts
    ├── ui/            # Componentes React del feature
    │   ├── RecordButton.tsx
    │   ├── AudioVisualizer.tsx
    │   └── TranscriptDisplay.tsx
    ├── lib/           # Utilidades específicas del feature
    │   └── audio-utils.ts
    └── index.ts       # Public API del feature
```

---

## Directrices de Código

### Límites de Líneas por Archivo

| Tipo de Archivo | Máximo Líneas | Razón |
|-----------------|---------------|-------|
| Componente UI | 80 | Fácil de leer, una responsabilidad |
| Hook personalizado | 50 | Lógica enfocada |
| State Machine | 120 | Puede tener múltiples estados |
| API Service | 60 | Una responsabilidad por servicio |
| Types/Interfaces | 50 | Definiciones claras |
| Utils/Lib | 40 | Funciones puras y pequeñas |
| Index (barrel) | 20 | Solo re-exports |

### Señales de que un archivo debe dividirse

- Más de 3 imports del mismo slice
- Más de 2 responsabilidades distintas
- Scroll necesario para entender el archivo
- Más de 5 funciones exportadas

### Nomenclatura

```typescript
// Componentes: PascalCase
RecordButton.tsx
AudioVisualizer.tsx

// Hooks: camelCase con prefijo 'use'
useInterview.ts
useAudioStream.ts

// State Machines: kebab-case con sufijo '.machine'
interview.machine.ts
payment.machine.ts

// API services: kebab-case
whisper.ts
elevenlabs.ts

// Types: kebab-case o junto al archivo que los usa
types.ts
interview.types.ts

// Utils: kebab-case
audio-utils.ts
time-format.ts
```

---

## Flujo de Datos

### 1. Flujo de Pago

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│ PaymentButton│────▶│ Stripe Checkout │────▶│ Webhook      │
│ (UI)         │     │ (External)      │     │ (API Route)  │
└──────────────┘     └─────────────────┘     └──────────────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │ State Machine│
                                            │ PAYMENT_OK   │
                                            └──────────────┘
```

### 2. Flujo de Entrevista (Loop de Voz)

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERVIEW LOOP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│   │ Usuario  │───▶│ Whisper  │───▶│  GPT-4   │───▶│ElevenLabs│ │
│   │ (Audio)  │    │  (STT)   │    │  (LLM)   │    │  (TTS)   │ │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│        │               │               │               │        │
│        │               ▼               ▼               ▼        │
│        │         ┌─────────────────────────────────────┐       │
│        │         │         Context Accumulator          │       │
│        │         │   (topics[], turns[], insights[])    │       │
│        │         └─────────────────────────────────────┘       │
│        │                           │                            │
│        └───────────────────────────┘                            │
│                    (loop hasta timeout)                         │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Flujo de Generación de Posts

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Accumulated     │────▶│ GPT-4           │────▶│ Post[]          │
│ Context         │     │ (Generation)    │     │ (4-7 ideas)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                              ┌──────────────────────────┤
                              ▼                          ▼
                        ┌──────────┐              ┌──────────┐
                        │ UI Cards │              │ PDF Gen  │
                        └──────────┘              └──────────┘
```

---

## Navegación de la Aplicación

### Rutas

```
/                    → Landing Page (SSR)
/interview           → Interview Page (CSR, requiere pago confirmado)
/results             → Results Page (CSR, requiere entrevista completada)
/api/webhooks/stripe → Webhook para confirmación de pago
```

### Guardias de Navegación

```typescript
// middleware.ts o en el componente de página
const canAccessInterview = (state: AppState) =>
  state.matches('paymentConfirmed') || state.matches('interviewActive');

const canAccessResults = (state: AppState) =>
  state.matches('results');
```

### Flujo de Usuario

```
1. Usuario llega a Landing (/)
2. Click en CTA → Abre modal de pago
3. Pago exitoso → Redirect a /interview
4. Entrevista de 10 min con PTT (Push-to-Talk)
5. Timer termina → Transición automática a generación
6. Posts generados → Mostrar en /results
7. Opción de descargar PDF
```

---

## State Machine Principal

```typescript
// src/app/model/app.machine.ts

type AppContext = {
  sessionId: string | null;
  paymentIntentId: string | null;
  interviewContext: {
    turns: Turn[];
    extractedTopics: string[];
    timeRemaining: number;
  };
  generatedPosts: Post[];
  error: string | null;
};

type AppEvents =
  | { type: 'INIT_PAYMENT' }
  | { type: 'PAYMENT_SUCCESS'; paymentIntentId: string }
  | { type: 'PAYMENT_FAILED'; error: string }
  | { type: 'START_INTERVIEW' }
  | { type: 'USER_RECORDING_START' }
  | { type: 'USER_RECORDING_STOP'; audioBlob: Blob }
  | { type: 'AI_RESPONSE_READY'; response: string }
  | { type: 'TIMER_TICK' }
  | { type: 'TIMER_END' }
  | { type: 'USER_FINAL_RESPONSE'; audioBlob: Blob }
  | { type: 'GENERATE_POSTS' }
  | { type: 'POSTS_READY'; posts: Post[] }
  | { type: 'DOWNLOAD_PDF' }
  | { type: 'RESET' };
```

---

## Comunicación entre Capas

### Feature → Feature (Prohibido directo)

Si dos features necesitan comunicarse, debe ser a través de:

1. **El widget que los compone**
2. **La state machine global**
3. **Eventos/callbacks pasados como props**

```typescript
// ❌ INCORRECTO
// features/voice-interview/ui/RecordButton.tsx
import { useTopicExtraction } from '@/features/topic-extraction';

// ✅ CORRECTO
// widgets/interview-panel/ui/InterviewPanel.tsx
import { RecordButton } from '@/features/voice-interview';
import { useTopicExtraction } from '@/features/topic-extraction';

const InterviewPanel = () => {
  const { extractTopics } = useTopicExtraction();

  const handleRecordingComplete = (transcript: string) => {
    extractTopics(transcript); // Widget orquesta
  };

  return <RecordButton onComplete={handleRecordingComplete} />;
};
```

### Shared → Cualquier capa

Shared puede ser importado por cualquier capa:

```typescript
// Cualquier archivo puede importar de shared
import { Button } from '@/shared/ui';
import { openaiClient } from '@/shared/api';
import { formatTime } from '@/shared/lib';
```

---

## Public API de cada Slice (index.ts)

Cada slice debe exportar solo lo necesario:

```typescript
// features/voice-interview/index.ts

// UI Components
export { RecordButton } from './ui/RecordButton';
export { AudioVisualizer } from './ui/AudioVisualizer';
export { TranscriptDisplay } from './ui/TranscriptDisplay';

// Hooks
export { useAudioRecording } from './model/useAudioRecording';

// Types (solo los necesarios externamente)
export type { Turn, RecordingState } from './model/types';

// NO exportar:
// - Funciones internas
// - API services directamente
// - State machines internas (exponer via hooks)
```

---

## Manejo de Errores

### Principio: Fail Fast, Recover Gracefully

```typescript
// Cada capa maneja sus errores específicos

// API Layer: Catch y transform
const transcribeAudio = async (blob: Blob): Promise<Result<string, TranscriptionError>> => {
  try {
    const result = await whisperClient.transcribe(blob);
    return { ok: true, data: result.text };
  } catch (error) {
    return { ok: false, error: new TranscriptionError(error) };
  }
};

// Feature Layer: Decide qué hacer
const handleRecordingComplete = async (blob: Blob) => {
  const result = await transcribeAudio(blob);
  if (!result.ok) {
    // Decidir: reintentar, mostrar error, o degradar gracefully
    send({ type: 'TRANSCRIPTION_FAILED', error: result.error });
    return;
  }
  send({ type: 'TRANSCRIPTION_SUCCESS', text: result.data });
};

// UI Layer: Mostrar feedback apropiado
const RecordButton = () => {
  const { error } = useInterview();

  if (error?.type === 'TRANSCRIPTION_FAILED') {
    return <RetryPrompt onRetry={handleRetry} />;
  }
  // ...
};
```

---

## Testing Strategy

### Por Capa

| Capa | Tipo de Test | Herramienta |
|------|--------------|-------------|
| shared/lib | Unit | Vitest |
| entities | Unit | Vitest |
| features/model | Unit + Integration | Vitest + XState test utils |
| features/api | Integration (mocked) | Vitest + MSW |
| features/ui | Component | Testing Library |
| widgets | Component | Testing Library |
| pages | E2E | Playwright |

### Prioridad de Testing para MVP

1. **State Machine** (crítico) - Todas las transiciones
2. **API Services** (crítico) - Happy path + errores
3. **Payment Flow** (crítico) - E2E completo
4. **Voice Loop** (importante) - Integration test

---

## Performance Considerations

### Optimizaciones Clave

1. **Audio Streaming**: No cargar todo en memoria
   ```typescript
   // Usar MediaRecorder con chunks pequeños
   mediaRecorder.start(1000); // chunk cada 1s
   ```

2. **Lazy Loading**: Cargar interview UI solo post-pago
   ```typescript
   const InterviewPage = dynamic(() => import('./InterviewPage'), {
     loading: () => <LoadingSpinner />
   });
   ```

3. **Fillers Pre-cargados**: Cargar audios de filler al confirmar pago
   ```typescript
   useEffect(() => {
     if (state.matches('paymentConfirmed')) {
       preloadFillerAudios();
     }
   }, [state]);
   ```

---

## Decisiones Arquitectónicas (ADRs)

### ADR-001: Push-to-Talk vs Voice Activity Detection

**Decisión**: Usar Push-to-Talk (PTT) para MVP

**Razón**:
- Reduce complejidad de VAD
- Usuario tiene control explícito
- Evita cortes accidentales
- Menor latencia percibida (usuario sabe cuándo esperar)

### ADR-002: State Machine Global vs Local

**Decisión**: Una state machine global para el flujo principal

**Razón**:
- El flujo es lineal y secuencial
- Evita estados inconsistentes entre features
- Facilita debugging y logging
- Permite time-travel debugging

### ADR-003: Client-side PDF Generation

**Decisión**: Generar PDF en el cliente con @react-pdf/renderer

**Razón**:
- No requiere servidor adicional
- Menor latencia
- Funciona offline una vez cargado
- Datos sensibles no viajan a servidor

---

## Checklist Pre-Commit

- [ ] Archivo < límite de líneas para su tipo
- [ ] Imports respetan regla de dependencias FSD
- [ ] Tipos explícitos (no `any`)
- [ ] Errores manejados apropiadamente
- [ ] Index.ts actualizado si hay nuevos exports públicos
- [ ] Sin console.log en código productivo
- [ ] Componentes tienen una sola responsabilidad
