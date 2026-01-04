'use client';

import type { Post } from '@/entities/post';
import { useLanguage, useTranslations } from '@/shared/i18n';

type PdfPreviewProps = {
  posts: Post[];
  isVisible: boolean;
  onClose: () => void;
};

export const PdfPreview = ({ posts, isVisible, onClose }: PdfPreviewProps) => {
  const lang = useLanguage();
  const { results } = useTranslations(lang);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {results.pdf.preview}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <div key={post.id} className="border-b pb-4">
              <h3 className="font-semibold">
                {i + 1}. {post.title}
              </h3>
              <p className="text-sm text-gray-600">{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
