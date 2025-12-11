import type { Post } from '@/entities/post';

type PdfGeneratorOptions = {
  posts: Post[];
  interviewDuration: string;
};

export const generatePdf = async (options: PdfGeneratorOptions): Promise<Blob> => {
  // TODO: Implement actual PDF generation with @react-pdf/renderer
  // This is a placeholder implementation

  const { posts, interviewDuration } = options;

  // For now, generate a simple text representation
  const content = `
VOICE CREATOR - Ideas de Contenido
Duración de entrevista: ${interviewDuration}
Fecha: ${new Date().toLocaleDateString('es')}

${posts.map((post, i) => `
${i + 1}. ${post.title}
   Plataforma: ${post.platform}
   Formato: ${post.contentType}

   ${post.description}

   Puntos clave:
   ${post.keyPoints.map((p) => `   • ${p}`).join('\n')}
`).join('\n---\n')}
  `.trim();

  return new Blob([content], { type: 'text/plain' });
};
