import { getAllPosts } from "@/data/posts";
import BlogCard from "@/components/BlogCard";
import NewsFetcher from "@/components/NewsFetcher";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="space-y-10">
      <section className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">欢迎来到我的博客</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          这里收录了我关于Web开发、编程和其他技术话题的文章
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">最新文章</h2>
          <div className="flex items-center gap-4">
            <NewsFetcher />
            <a href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
              查看全部
            </a>
          </div>
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
