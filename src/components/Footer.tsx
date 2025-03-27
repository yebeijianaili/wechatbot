"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

export default function Footer() {
  // 在客户端使用state存储年份
  const [year, setYear] = useState('');
  
  // 在客户端组件挂载后设置年份
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="py-12 border-t border-muted mt-12 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-6 sm:mb-0">
            <h3 className="text-lg font-semibold mb-2">我的博客</h3>
            <p className="text-sm text-muted-foreground">
              © {year} 版权所有
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <h4 className="font-medium mb-4">链接</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-foreground">
                    <a href="/">首页</a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-foreground">
                    <a href="/blog">所有文章</a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-foreground">
                    <a href="/about">关于我</a>
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">社交媒体</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-foreground">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-foreground">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-foreground">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 