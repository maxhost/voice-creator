# Voice Creator - Folder Structure

```
voice-creator/
├── docs/
│   ├── ARCHITECTURE.md          # Este documento
│   └── FOLDER_STRUCTURE.md      # Estructura de carpetas
│
├── public/
│   └── audio/
│       └── fillers/             # Audios pre-grabados de "thinking"
│           ├── thinking-01.mp3
│           ├── thinking-02.mp3
│           └── ...
│
├── src/
│   ├── app/                     # Next.js App Router + Providers
│   │   ├── providers/
│   │   │   ├── index.tsx        # Compose all providers
│   │   │   ├── StateMachineProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing page route
│   │   ├── interview/
│   │   │   └── page.tsx         # Interview page route
│   │   ├── results/
│   │   │   └── page.tsx         # Results page route
│   │   └── api/
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts # Stripe webhook handler
│   │
│   ├── pages/                   # Page compositions (no routing)
│   │   ├── landing/
│   │   │   └── ui/
│   │   │       └── LandingPage.tsx
│   │   ├── interview/
│   │   │   └── ui/
│   │   │       └── InterviewPage.tsx
│   │   └── results/
│   │       └── ui/
│   │           └── ResultsPage.tsx
│   │
│   ├── widgets/                 # Complex UI blocks
│   │   ├── interview-panel/
│   │   │   ├── ui/
│   │   │   │   └── InterviewPanel.tsx
│   │   │   ├── model/
│   │   │   │   └── useInterviewPanel.ts
│   │   │   └── index.ts
│   │   ├── results-panel/
│   │   │   ├── ui/
│   │   │   │   └── ResultsPanel.tsx
│   │   │   ├── model/
│   │   │   │   └── useResultsPanel.ts
│   │   │   └── index.ts
│   │   └── payment-modal/
│   │       ├── ui/
│   │       │   └── PaymentModal.tsx
│   │       ├── model/
│   │       │   └── usePaymentModal.ts
│   │       └── index.ts
│   │
│   ├── features/                # Business features
│   │   ├── payment/
│   │   │   ├── api/
│   │   │   │   ├── stripe.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── payment.machine.ts
│   │   │   │   ├── usePayment.ts
│   │   │   │   └── types.ts
│   │   │   ├── ui/
│   │   │   │   ├── PaymentButton.tsx
│   │   │   │   └── PaymentStatus.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── voice-interview/
│   │   │   ├── api/
│   │   │   │   ├── whisper.ts
│   │   │   │   ├── openai.ts
│   │   │   │   ├── elevenlabs.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── interview.machine.ts
│   │   │   │   ├── audio.stream.ts
│   │   │   │   ├── useInterview.ts
│   │   │   │   ├── useAudioRecording.ts
│   │   │   │   └── types.ts
│   │   │   ├── ui/
│   │   │   │   ├── RecordButton.tsx
│   │   │   │   ├── AudioVisualizer.tsx
│   │   │   │   ├── TranscriptDisplay.tsx
│   │   │   │   ├── TimerDisplay.tsx
│   │   │   │   └── ThinkingIndicator.tsx
│   │   │   ├── lib/
│   │   │   │   ├── audio-utils.ts
│   │   │   │   └── filler-manager.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── topic-extraction/
│   │   │   ├── api/
│   │   │   │   ├── extract.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── useTopicExtraction.ts
│   │   │   │   ├── context-accumulator.ts
│   │   │   │   └── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── post-generation/
│   │   │   ├── api/
│   │   │   │   ├── generate.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── usePostGeneration.ts
│   │   │   │   └── types.ts
│   │   │   ├── ui/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   └── PostList.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── pdf-export/
│   │       ├── api/
│   │       │   ├── generator.ts
│   │       │   └── index.ts
│   │       ├── ui/
│   │       │   ├── DownloadButton.tsx
│   │       │   └── PdfPreview.tsx
│   │       └── index.ts
│   │
│   ├── entities/                # Domain entities
│   │   ├── post/
│   │   │   ├── model/
│   │   │   │   └── types.ts
│   │   │   ├── ui/
│   │   │   │   └── PostPreview.tsx
│   │   │   └── index.ts
│   │   └── interview-session/
│   │       ├── model/
│   │       │   └── types.ts
│   │       ├── api/
│   │       │   └── session.ts
│   │       └── index.ts
│   │
│   └── shared/                  # Shared code
│       ├── api/
│       │   ├── openai-client.ts
│       │   ├── stripe-client.ts
│       │   └── index.ts
│       ├── config/
│       │   ├── env.ts
│       │   └── constants.ts
│       ├── lib/
│       │   ├── format-time.ts
│       │   ├── result.ts        # Result<T, E> type
│       │   └── index.ts
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── Modal.tsx
│       │   ├── Spinner.tsx
│       │   └── index.ts
│       └── types/
│           └── index.ts
│
├── .env.local                   # Environment variables (git ignored)
├── .env.example                 # Example env vars
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Notas sobre la Estructura

### App vs Pages

- `src/app/` → Next.js App Router (routing, layouts, API routes)
- `src/pages/` → FSD pages layer (composición de widgets, NO routing)

El contenido real de cada página está en `src/pages/*/ui/`, y los archivos en `src/app/*/page.tsx` solo importan y renderizan esos componentes.

### Index Files

Cada slice tiene un `index.ts` que actúa como Public API:

```typescript
// features/voice-interview/index.ts
export { RecordButton } from './ui/RecordButton';
export { useInterview } from './model/useInterview';
export type { Turn } from './model/types';
```

### Convención de Archivos

| Patrón | Uso |
|--------|-----|
| `*.tsx` | Componentes React |
| `*.ts` | Lógica, tipos, utils |
| `*.machine.ts` | State machines (XState) |
| `*.stream.ts` | RxJS streams |
| `use*.ts` | Custom hooks |
| `types.ts` | Definiciones de tipos del slice |
