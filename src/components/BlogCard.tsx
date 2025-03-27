import Link from 'next/link';
import { Post } from '@/data/posts';

type BlogCardProps = {
  post: Post;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block p-6">
        <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
        <time className="text-gray-500 dark:text-gray-400 mb-3 block text-sm">{post.date}</time>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
        <span className="text-blue-600 dark:text-blue-400 font-medium">Read more →</span>
      </Link>
    </article>
  );
} 