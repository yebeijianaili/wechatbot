import { getAllPosts, getPostBySlug } from "@/data/posts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "文章未找到 | 我的博客",
      description: "请求的博客文章未找到。",
    };
  }

  return {
    title: `${post.title} | 我的博客`,
    description: post.excerpt,
    openGraph: post.imageUrl ? {
      images: [{ url: post.imageUrl }]
    } : undefined
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-10 space-y-4">
        <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 -ml-2 mb-2">
          <Link href="/blog">
            ← 返回所有文章
          </Link>
        </Button>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{post.title}</h1>
        
        <div className="flex items-center gap-2">
          <time className="text-muted-foreground">{post.date}</time>
          {post.source && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                来源: {post.sourceUrl ? (
                  <a 
                    href={post.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {post.source}
                  </a>
                ) : post.source}
              </span>
            </>
          )}
        </div>

        {post.imageUrl && (
          <div className="relative w-full h-64 sm:h-96 mt-6 mb-8 rounded-lg overflow-hidden">
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>
      
      <div 
        className="prose prose-gray dark:prose-invert lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} 
      />
    </article>
  );
}

// Simple markdown renderer
function renderMarkdown(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>')
    .replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>')
    .replace(/\n\n/gm, '</p><p>')
    .replace(/```([\s\S]*?)```/gm, (_, code) => `<pre><code>${code.trim()}</code></pre>`)
    .replace(/`([^`]+)`/gm, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/gm, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gm, '<a href="$2">$1</a>')
    .replace(/^(?!<[a-z])/gm, '<p>')
    .replace(/^<\/ul><p>/gm, '</ul>')
    .replace(/^<\/h\d><p>/gm, '</h1>')
    .replace(/^<\/pre><p>/gm, '</pre>')
    .replace(/<\/p>$/gm, '');
} 