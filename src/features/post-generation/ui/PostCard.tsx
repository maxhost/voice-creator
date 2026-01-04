'use client';

import type { Post } from '@/entities/post';
import { useLanguage, useTranslations } from '@/shared/i18n';

type PostCardProps = {
  post: Post;
  index: number;
};

const platformColors: Record<string, string> = {
  linkedin: 'text-blue-700 bg-blue-100',
  twitter: 'text-sky-700 bg-sky-100',
  instagram: 'text-pink-700 bg-pink-100',
  tiktok: 'text-gray-900 bg-gray-200',
  youtube: 'text-red-700 bg-red-100',
  facebook: 'text-indigo-700 bg-indigo-100',
};

export const PostCard = ({ post, index }: PostCardProps) => {
  const lang = useLanguage();
  const { results } = useTranslations(lang);
  const colorClass = platformColors[post.platform] || 'text-gray-700 bg-gray-100';
  const platformLabel = results.postCard.platforms[post.platform as keyof typeof results.postCard.platforms] || post.platform;

  // Map content type to translation
  const contentTypeLabel = results.postCard.contentTypes[post.contentType as keyof typeof results.postCard.contentTypes] || post.contentType;

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${colorClass}`}>
          {platformLabel}
        </span>
        <span className="text-sm text-gray-400 font-medium">#{index + 1}</span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 leading-tight">{post.title}</h3>

      <p className="text-gray-600 text-sm leading-relaxed">{post.description}</p>

      {post.keyPoints && post.keyPoints.length > 0 && (
        <ul className="text-sm text-gray-600 space-y-2 pt-2 border-t border-gray-100">
          {post.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-3 flex items-center gap-2 border-t border-gray-100">
        <span className="text-xs text-gray-500 font-medium">
          {results.postCard.format}
        </span>
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">
          {contentTypeLabel}
        </span>
      </div>
    </div>
  );
};
