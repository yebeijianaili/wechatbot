"use client";

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from 'react';
import { getAllPosts, Post } from "@/data/posts";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // 获取所有文章并设置状态
  useEffect(() => {
    setPosts(getAllPosts());
  }, []);

  // 当搜索查询更改时过滤文章
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(lowerSearch) || 
      post.excerpt.toLowerCase().includes(lowerSearch)
    );
    
    setFilteredPosts(filtered);
  }, [search, posts]);

  // 每5秒重新获取文章列表，以包含可能通过API添加的新文章
  useEffect(() => {
    const interval = setInterval(() => {
      if (open) {
        setPosts(getAllPosts());
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [open]);

  return (
    <header className="py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 ring-2 ring-blue-500 shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">CN</AvatarFallback>
            </Avatar>
            <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hidden sm:block transition-transform hover:scale-105">
              My Blog
            </Link>
          </div>
          
          <div className="relative w-full max-w-md mx-4 hidden md:block">
            <Input 
              type="text" 
              placeholder="搜索文章..." 
              className="w-full pl-10 border-blue-100 dark:border-blue-900/30 focus:ring-blue-500/20 focus:border-blue-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link href="/">
                首页
              </Link>
            </Button>
            <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link href="/blog">
                所有文章
              </Link>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-blue-100 dark:border-blue-900/30">
                <div className="grid gap-4 py-4">
                  <Button variant="ghost" asChild className="justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Link href="/">
                      首页
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Link href="/blog">
                      所有文章
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Link href="/about">
                      关于我
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Link href="/contact">
                      联系方式
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 