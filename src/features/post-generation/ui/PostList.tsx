'use client';

import type { Post } from '@/entities/post';
import { PostCard } from './PostCard';

type PostListProps = {
  posts: Post[];
};

export const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay posts generados
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};
