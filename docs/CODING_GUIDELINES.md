# Voice Creator - Coding Guidelines

## Principios Fundamentales

1. **Un archivo = Una responsabilidad**
2. **Archivos pequeños y manejables**
3. **Imports explícitos, nunca circulares**
4. **Tipos estrictos, nunca `any`**
5. **Errores manejados, nunca silenciados**

---

## Límites de Líneas por Tipo de Archivo

| Tipo | Máximo | Hard Limit | Acción si excede |
|------|--------|------------|------------------|
| Componente UI | 80 | 100 | Extraer sub-componentes |
| Hook | 50 | 70 | Dividir en hooks más pequeños |
| State Machine | 120 | 150 | Usar child machines |
| API Service | 60 | 80 | Separar por endpoint |
| Types | 50 | 70 | Agrupar en archivos por dominio |
| Utils | 40 | 50 | Una función por archivo si es grande |
| Index (barrel) | 20 | 30 | Solo re-exports |

---

## Estructura de Archivos

### Componente UI (.tsx)

```typescript
// features/voice-interview/ui/RecordButton.tsx
// Máximo: 80 líneas

import { useState } from 'react';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
import type { RecordButtonProps } from './types';

/**
 * Botón de grabación con estados visual.
 * Push-to-talk: presionar para grabar, soltar para enviar.
 */
export const RecordButton = ({
  onStart,
  onStop,
  disabled = false,
  className,
}: RecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleMouseDown = () => {
    if (disabled) return;
    setIsRecording(true);
    onStart();
  };

  const handleMouseUp = () => {
    if (!isRecording) return;
    setIsRecording(false);
    onStop();
  };

  return (
    <Button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      className={cn(
        'rounded-full w-20 h-20 transition-all',
        isRecording && 'scale-110 bg-red-500',
        className
      )}
      aria-label={isRecording ? 'Grabando...' : 'Mantener para grabar'}
    >
      {isRecording ? <MicOnIcon /> : <MicOffIcon />}
    </Button>
  );
};
```

### Hook Personalizado (.ts)

```typescript
// features/voice-interview/model/useAudioRecording.ts
// Máximo: 50 líneas

import { useState, useCallback, useRef } from 'react';
import type { RecordingState } from './types';

export const useAudioRecording = () => {
  const [state, setState] = useState<RecordingState>('idle');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.start();
    setState('recording');
  }, []);

  const stop = useCallback(async (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) throw new Error('No recorder');

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];
        setState('idle');
        resolve(blob);
      };

      mediaRecorder.current.stop();
      setState('processing');
    });
  }, []);

  return { state, start, stop };
};
```

### API Service (.ts)

```typescript
// features/voice-interview/api/whisper.ts
// Máximo: 60 líneas

import { openaiClient } from '@/shared/api';
import type { Result } from '@/shared/lib';
import type { TranscriptionResult, WhisperError } from './types';

const WHISPER_MODEL = 'whisper-1';

export const transcribeAudio = async (
  audioBlob: Blob
): Promise<Result<TranscriptionResult, WhisperError>> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', WHISPER_MODEL);
    formData.append('language', 'es');

    const response = await openaiClient.audio.transcriptions.create({
      file: audioBlob,
      model: WHISPER_MODEL,
    });

    return {
      ok: true,
      data: {
        text: response.text,
        duration: response.duration,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'TRANSCRIPTION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        retryable: true,
      },
    };
  }
};
```

### State Machine (.machine.ts)

```typescript
// features/voice-interview/model/interview.machine.ts
// Máximo: 120 líneas

import { createMachine, assign } from 'xstate';
import type { InterviewContext, InterviewEvents } from './types';

export const interviewMachine = createMachine({
  id: 'interview',
  initial: 'idle',
  context: {
    turns: [],
    timeRemaining: 600,
    currentTranscript: null,
  } satisfies InterviewContext,

  states: {
    idle: {
      on: {
        START: 'waitingForUser',
      },
    },

    waitingForUser: {
      on: {
        START_RECORDING: 'recording',
        TIMER_END: 'closing',
      },
    },

    recording: {
      on: {
        STOP_RECORDING: {
          target: 'processing',
          actions: 'saveAudioBlob',
        },
      },
    },

    processing: {
      invoke: {
        src: 'processAudio',
        onDone: {
          target: 'aiResponding',
          actions: 'addUserTurn',
        },
        onError: {
          target: 'waitingForUser',
          actions: 'setError',
        },
      },
    },

    aiResponding: {
      invoke: {
        src: 'generateResponse',
        onDone: {
          target: 'playingResponse',
          actions: 'addAiTurn',
        },
        onError: {
          target: 'waitingForUser',
          actions: 'setError',
        },
      },
    },

    playingResponse: {
      invoke: {
        src: 'playAudio',
        onDone: 'waitingForUser',
      },
    },

    closing: {
      // Dar oportunidad de respuesta final si IA habló último
      always: [
        { guard: 'aiSpokeLastAndTimeout', target: 'finalResponse' },
        { target: 'complete' },
      ],
    },

    finalResponse: {
      on: {
        FINAL_RECORDING_COMPLETE: 'complete',
      },
      after: {
        30000: 'complete', // 30s máximo para respuesta final
      },
    },

    complete: {
      type: 'final',
    },
  },
});
```

### Types (.ts)

```typescript
// features/voice-interview/model/types.ts
// Máximo: 50 líneas

export type RecordingState = 'idle' | 'recording' | 'processing';

export type Turn = {
  id: string;
  speaker: 'user' | 'ai';
  transcript: string;
  timestamp: number;
  extractedTopics: string[];
};

export type InterviewContext = {
  turns: Turn[];
  timeRemaining: number;
  currentTranscript: string | null;
  error: InterviewError | null;
};

export type InterviewEvents =
  | { type: 'START' }
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING'; audioBlob: Blob }
  | { type: 'TRANSCRIPTION_COMPLETE'; transcript: string }
  | { type: 'AI_RESPONSE_READY'; response: string }
  | { type: 'AUDIO_PLAYBACK_COMPLETE' }
  | { type: 'TIMER_TICK' }
  | { type: 'TIMER_END' }
  | { type: 'FINAL_RECORDING_COMPLETE' };

export type InterviewError = {
  code: string;
  message: string;
  retryable: boolean;
};
```

### Index / Barrel File (.ts)

```typescript
// features/voice-interview/index.ts
// Máximo: 20 líneas

// UI Components
export { RecordButton } from './ui/RecordButton';
export { AudioVisualizer } from './ui/AudioVisualizer';
export { TranscriptDisplay } from './ui/TranscriptDisplay';
export { TimerDisplay } from './ui/TimerDisplay';
export { ThinkingIndicator } from './ui/ThinkingIndicator';

// Hooks
export { useAudioRecording } from './model/useAudioRecording';
export { useInterview } from './model/useInterview';

// Types
export type { Turn, RecordingState, InterviewError } from './model/types';
```

---

## Convenciones de Nomenclatura

### Archivos

```
PascalCase.tsx     → Componentes React
camelCase.ts       → Hooks, utils, services
kebab-case.ts      → Archivos de configuración
*.machine.ts       → State machines
*.stream.ts        → RxJS streams
*.types.ts         → Tipos (alternativa a types.ts)
```

### Variables y Funciones

```typescript
// Constantes globales: SCREAMING_SNAKE_CASE
const MAX_INTERVIEW_DURATION = 600;
const API_ENDPOINTS = { ... };

// Funciones: camelCase, verbos descriptivos
const transcribeAudio = () => {};
const handleRecordingComplete = () => {};
const buildPromptFromContext = () => {};

// Booleanos: prefijo is/has/should/can
const isRecording = true;
const hasPaymentCompleted = false;
const shouldShowTimer = true;

// Handlers: prefijo handle + Evento
const handleClick = () => {};
const handleSubmit = () => {};
const handleRecordingStart = () => {};
```

### Componentes

```typescript
// Nombre descriptivo del propósito
RecordButton        // ✅ Claro
AudioRecordBtn      // ❌ Abreviado
Button1             // ❌ No descriptivo

// Props interface: ComponentNameProps
type RecordButtonProps = { ... };
type AudioVisualizerProps = { ... };
```

### Tipos

```typescript
// Entidades: Sustantivo singular
type Post = { ... };
type Turn = { ... };
type Topic = { ... };

// Estados: Sufijo State o como union
type RecordingState = 'idle' | 'recording' | 'processing';
type PaymentState = { status: PaymentStatus; ... };

// Eventos: Sufijo Event o como union type
type InterviewEvents =
  | { type: 'START' }
  | { type: 'STOP' };

// Errores: Sufijo Error
type TranscriptionError = { ... };
type PaymentError = { ... };
```

---

## Imports

### Orden de Imports

```typescript
// 1. React y librerías externas
import { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';

// 2. Shared (aliases)
import { Button, Card } from '@/shared/ui';
import { formatTime } from '@/shared/lib';
import { openaiClient } from '@/shared/api';

// 3. Entities
import { Post } from '@/entities/post';

// 4. Features (solo si es widget o superior)
import { RecordButton } from '@/features/voice-interview';

// 5. Imports relativos del mismo slice
import { useLocalHook } from './useLocalHook';
import type { LocalType } from './types';

// 6. Styles (si aplica)
import styles from './Component.module.css';
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

---

## Manejo de Errores

### Patrón Result

```typescript
// shared/lib/result.ts

export type Result<T, E> =
  | { ok: true; data: T }
  | { ok: false; error: E };

// Uso
const result = await transcribeAudio(blob);

if (!result.ok) {
  // Manejar error específicamente
  if (result.error.retryable) {
    // Reintentar
  }
  return;
}

// Usar data con seguridad de tipos
console.log(result.data.text);
```

### Errores en Componentes

```typescript
// NO silenciar errores
const handleClick = async () => {
  try {
    await doSomething();
  } catch (error) {
    // ❌ MAL: silenciar
    console.log(error);
  }
};

// SÍ propagar o manejar explícitamente
const handleClick = async () => {
  const result = await doSomething();

  if (!result.ok) {
    // ✅ BIEN: UI feedback
    setError(result.error);
    // o enviar a state machine
    send({ type: 'ERROR', error: result.error });
    return;
  }

  // continuar con éxito
};
```

---

## Testing

### Nomenclatura de Tests

```typescript
// ComponentName.test.tsx para componentes
// hookName.test.ts para hooks
// serviceName.test.ts para services

// Estructura de describe/it
describe('RecordButton', () => {
  describe('when idle', () => {
    it('shows microphone icon', () => {});
    it('is not disabled by default', () => {});
  });

  describe('when recording', () => {
    it('shows recording indicator', () => {});
    it('calls onStop when released', () => {});
  });
});
```

### Ubicación de Tests

```
features/
└── voice-interview/
    ├── ui/
    │   ├── RecordButton.tsx
    │   └── __tests__/
    │       └── RecordButton.test.tsx
    └── model/
        ├── useAudioRecording.ts
        └── __tests__/
            └── useAudioRecording.test.ts
```

---

## Comentarios

### Cuándo Comentar

```typescript
// ✅ Comentar: Por qué, no qué
// Whisper tiene mejor precisión con chunks de al menos 1s
mediaRecorder.start(1000);

// ✅ Comentar: Decisiones no obvias
// Usamos 30s extra porque el usuario puede estar formulando respuesta
after: { 30000: 'complete' }

// ❌ No comentar: Lo obvio
// Incrementa el contador  ← innecesario
counter++;
```

### JSDoc para Public APIs

```typescript
/**
 * Transcribe audio usando OpenAI Whisper.
 *
 * @param audioBlob - Audio en formato webm/opus
 * @returns Resultado con transcripción o error
 *
 * @example
 * const result = await transcribeAudio(blob);
 * if (result.ok) console.log(result.data.text);
 */
export const transcribeAudio = async (
  audioBlob: Blob
): Promise<Result<TranscriptionResult, WhisperError>> => {
  // ...
};
```

---

## Checklist Pre-Commit

```markdown
- [ ] Archivo dentro del límite de líneas
- [ ] Imports siguen el orden establecido
- [ ] No hay imports circulares
- [ ] No hay `any` (usar `unknown` si es necesario)
- [ ] Errores manejados con Result o try/catch explícito
- [ ] Nombres descriptivos (no abreviaciones)
- [ ] Index.ts actualizado si hay nuevos exports
- [ ] Sin console.log en código productivo
- [ ] Tipos exportados si son necesarios externamente
```
