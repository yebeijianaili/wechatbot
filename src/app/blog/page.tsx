import { getAllPosts } from "@/data/posts";
import BlogCard from "@/components/BlogCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Blog Posts | My Blog",
  description: "Browse all articles on My Blog",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Blog Posts</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse all articles on various topics.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
} 