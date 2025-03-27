import { getAllPosts } from "@/data/posts";
import BlogCard from "@/components/BlogCard";
import { Metadata } from "next";
import NewsFetcher from "@/components/NewsFetcher";

export const metadata: Metadata = {
  title: "所有文章 | 我的博客",
  description: "浏览我博客上的所有文章",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-10">
      <section className="py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">所有文章</h1>
            <p className="text-muted-foreground">
              浏览我的所有技术文章和心得分享
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <NewsFetcher />
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
} 