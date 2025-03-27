"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4">文章未找到</h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        您查找的博客文章不存在或可能已被移动。
      </p>
      <Button asChild size="lg">
        <Link href="/blog">
          查看所有文章
        </Link>
      </Button>
    </div>
  );
} 