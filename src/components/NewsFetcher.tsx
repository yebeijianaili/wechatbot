"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Post } from '@/data/posts';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/toast';

export default function NewsFetcher() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  async function fetchLatestNews() {
    setLoading(true);

    try {
      const response = await fetch('/api/news');
      const data = await response.json();

      if (data.success) {
        setLastUpdated(new Date());
        toast({
          title: "新闻获取成功",
          description: `已添加 ${data.newsAdded} 篇新文章`,
        });
      } else {
        throw new Error(data.error || '获取新闻失败');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "获取新闻失败",
        description: "请稍后再试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // 首次加载时自动获取新闻
  useEffect(() => {
    fetchLatestNews();
    
    // 设置每小时自动刷新
    const interval = setInterval(fetchLatestNews, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={fetchLatestNews} 
        disabled={loading}
        variant="outline"
        size="sm"
      >
        {loading ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            更新中...
          </>
        ) : (
          <>
            <ReloadIcon className="mr-2 h-4 w-4" />
            获取最新新闻
          </>
        )}
      </Button>
      
      {lastUpdated && (
        <p className="text-xs text-muted-foreground">
          最后更新: {lastUpdated.toLocaleString()}
        </p>
      )}
    </div>
  );
} 