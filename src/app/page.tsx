import { getAllPosts } from "@/data/posts";
import BlogCard from "@/components/BlogCard";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="space-y-16">
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            欢迎来到我的博客
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            这里收录了我关于Web开发、编程和其他技术话题的文章
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold relative">
            <span className="relative z-10">最新文章</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-200/50 dark:bg-blue-900/30 -z-10 transform -rotate-1"></span>
          </h2>
          <a href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center group">
            查看全部
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
