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
    <article className="rounded-lg overflow-hidden transition-all border border-muted group hover:shadow-xl hover:-translate-y-1 duration-300">
      <div className="flex flex-col h-full">
        {post.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow bg-card">
          <h2 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          
          <div className="flex items-center gap-2 mb-3">
            <time className="text-muted-foreground text-sm font-medium">{post.date}</time>
            {post.source && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm">
                  来源: <span className="font-medium">{post.source}</span>
                </span>
              </>
            )}
          </div>
          
          <p className="text-foreground/80 mb-5 line-clamp-3 flex-grow">{post.excerpt}</p>
          
          <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 p-0 h-auto w-fit group-hover:translate-x-1 transition-transform">
            <Link href={`/blog/${post.slug}`} className="inline-flex items-center">
              阅读更多 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
} 