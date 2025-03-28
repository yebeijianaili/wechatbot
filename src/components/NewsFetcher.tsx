"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from './ui/toast'; // Changed from @/ to relative path
import { PLATFORMS, NewsPlatform } from '@/lib/news-api';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewsFetcher() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<NewsPlatform>('jinritoutiao');
  const [platformName, setPlatformName] = useState('今日头条');
  const { toast } = useToast();

  // 使用 useCallback 包装 fetchLatestNews 函数，避免依赖问题
  const fetchLatestNews = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/news?platform=${selectedPlatform}`);
      const data = await response.json();

      if (data.success) {
        setLastUpdated(new Date());
        setPlatformName(data.platformName || selectedPlatform);
        toast({
          title: "新闻获取成功",
          description: `已添加 ${data.newsAdded} 篇${data.platformName || selectedPlatform}热门文章`,
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
  }, [selectedPlatform, toast]);

  // 当平台变化时自动获取新闻
  useEffect(() => {
    fetchLatestNews();
  }, [selectedPlatform, fetchLatestNews]);

  // 首次加载时自动获取新闻
  useEffect(() => {
    // 设置每小时自动刷新
    const interval = setInterval(fetchLatestNews, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLatestNews]);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">热门新闻获取</h3>
          <p className="text-sm text-muted-foreground">
            从各大平台获取最新热门话题
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as NewsPlatform)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择平台" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platformName === platform ? platformName : platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchLatestNews} disabled={loading}>
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                获取中
              </>
            ) : (
              "刷新"
            )}
          </Button>
        </div>
      </div>
      
      {lastUpdated && (
        <p className="text-xs text-muted-foreground pt-2 border-t">
          上次更新: {lastUpdated.toLocaleString()}
        </p>
      )}
    </div>
  );
} 