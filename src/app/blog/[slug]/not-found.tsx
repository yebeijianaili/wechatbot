import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Post Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        The blog post you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/blog"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        View All Posts
      </Link>
    </div>
  );
} 