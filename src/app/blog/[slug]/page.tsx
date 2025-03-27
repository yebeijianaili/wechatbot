import { getAllPosts, getPostBySlug } from "@/data/posts";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | My Blog",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | My Blog`,
    description: post.excerpt,
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
    <article className="prose prose-blue lg:prose-lg dark:prose-invert mx-auto">
      <div className="mb-8">
        <h1 className="mb-2">{post.title}</h1>
        <time className="text-gray-500 dark:text-gray-400">{post.date}</time>
      </div>
      
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
      
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <a href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to all posts
        </a>
      </div>
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