import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Brain to Post - Genera ideas de contenido con IA',
  description: 'Entrevista con IA para generar ideas de posts para redes sociales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* 100% privacy-first analytics */}
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
