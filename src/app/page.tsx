import { getAllPosts } from "@/data/posts";
import BlogCard from "@/components/BlogCard";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A collection of articles about web development, programming, and more.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
