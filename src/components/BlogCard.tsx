"use client";

import Link from 'next/link';
import { Post } from '@/data/posts';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type BlogCardProps = {
  post: Post;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="rounded-lg overflow-hidden transition-all hover:shadow-md border border-muted group">
      <div className="flex flex-col h-full">
        {post.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold mb-2 line-clamp-2">
            <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
              {post.title}
            </Link>
          </h2>
          
          <div className="flex items-center gap-2 mb-3">
            <time className="text-muted-foreground text-sm">{post.date}</time>
            {post.source && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm">
                  来源: {post.source}
                </span>
              </>
            )}
          </div>
          
          <p className="text-foreground/80 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
          
          <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 p-0 h-auto w-fit">
            <Link href={`/blog/${post.slug}`}>
              阅读更多 →
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
} 