import { jsPDF } from 'jspdf';
import type { Post } from '@/entities/post';
import { getBrowserLanguage } from '@/shared/i18n';
import { locales } from '@/shared/i18n';

type PdfGeneratorOptions = {
  posts: Post[];
  interviewDuration: string;
};

export const generatePdf = async (options: PdfGeneratorOptions): Promise<Blob> => {
  const { posts, interviewDuration } = options;
  const lang = getBrowserLanguage();
  const { results } = locales[lang] || locales.en;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Helper to add new page if needed
  const checkNewPage = (requiredSpace: number) => {
    if (y + requiredSpace > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(results.pdf.title, pageWidth / 2, y, { align: 'center' });
  y += 12;

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(results.pdf.generatedBy, pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.text(`${results.pdf.interviewDuration} ${interviewDuration} | ${new Date().toLocaleDateString(lang)}`, pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Posts
  posts.forEach((post, index) => {
    checkNewPage(60);

    // Post number and platform badge
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(`#${index + 1}`, margin, y);

    const platform = results.postCard.platforms[post.platform as keyof typeof results.postCard.platforms] || post.platform;
    const contentType = results.postCard.contentTypes[post.contentType as keyof typeof results.postCard.contentTypes] || post.contentType;
    doc.text(`${platform} • ${contentType}`, pageWidth - margin, y, { align: 'right' });
    y += 8;

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const titleLines = doc.splitTextToSize(post.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 6 + 4;

    // Description
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(post.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 6;

    // Key points
    if (post.keyPoints.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(80, 80, 80);

      post.keyPoints.forEach((point) => {
        checkNewPage(10);
        const pointLines = doc.splitTextToSize(`• ${point}`, contentWidth - 10);
        doc.text(pointLines, margin + 5, y);
        y += pointLines.length * 4 + 2;
      });
      y += 4;
    }

    // Suggested hooks (if any)
    if (post.suggestedHooks && post.suggestedHooks.length > 0) {
      checkNewPage(15);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(results.pdf.alternativeHooks, margin, y);
      y += 5;

      post.suggestedHooks.slice(0, 2).forEach((hook) => {
        const hookLines = doc.splitTextToSize(`→ ${hook}`, contentWidth - 10);
        doc.text(hookLines, margin + 5, y);
        y += hookLines.length * 4;
      });
      y += 4;
    }

    // Divider between posts
    if (index < posts.length - 1) {
      checkNewPage(20);
      y += 5;
      doc.setDrawColor(230, 230, 230);
      doc.line(margin + 20, y, pageWidth - margin - 20, y);
      y += 15;
    }
  });

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `voice-creator.com | ${results.pdf.pageOf} ${i} ${results.pdf.of} ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc.output('blob');
};
