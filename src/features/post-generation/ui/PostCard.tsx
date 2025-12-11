'use client';

import type { Post } from '@/entities/post';

type PostCardProps = {
  post: Post;
  index: number;
};

const platformColors: Record<string, string> = {
  linkedin: 'text-blue-600 bg-blue-50',
  twitter: 'text-sky-500 bg-sky-50',
  instagram: 'text-pink-500 bg-pink-50',
  tiktok: 'text-gray-900 bg-gray-100',
  youtube: 'text-red-600 bg-red-50',
};

export const PostCard = ({ post, index }: PostCardProps) => {
  const colorClass = platformColors[post.platform] || 'text-gray-600 bg-gray-50';

  return (
    <div className="p-6 border border-gray-200 rounded-lg space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium px-2 py-1 rounded ${colorClass}`}>
          {post.platform}
        </span>
        <span className="text-sm text-gray-400">#{index + 1}</span>
      </div>

      <h3 className="text-lg font-semibold">{post.title}</h3>

      <p className="text-gray-600 text-sm">{post.description}</p>

      {post.keyPoints.length > 0 && (
        <ul className="text-sm text-gray-500 space-y-1">
          {post.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary-500">•</span>
              {point}
            </li>
          ))}
        </ul>
      )}

      <div className="pt-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">Formato:</span>
        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
          {post.contentType}
        </span>
      </div>
    </div>
  );
};
