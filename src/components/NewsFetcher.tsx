"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Post } from '@/data/posts';
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

  async function fetchLatestNews() {
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
  }

  // 当平台变化时自动获取新闻
  useEffect(() => {
    fetchLatestNews();
  }, [selectedPlatform]);

  // 首次加载时自动获取新闻
  useEffect(() => {
    // 设置每小时自动刷新
    const interval = setInterval(fetchLatestNews, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 平台显示名称映射
  const platformDisplayNames: Record<NewsPlatform, string> = {
    'baidu': '百度热搜',
    'zhihu': '知乎热榜',
    'weibo': '微博热搜',
    'jinritoutiao': '今日头条',
    'bilibili': 'B站热榜',
    'douyin': '抖音热点',
    'juejin': '掘金热榜',
    'douban': '豆瓣热榜',
    '36kr': '36氪热榜',
    // 添加其他平台
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex items-center gap-2">
        <Select
          value={selectedPlatform}
          onValueChange={(value: string) => setSelectedPlatform(value as NewsPlatform)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="选择平台" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platformDisplayNames[platform]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
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
              刷新
            </>
          )}
        </Button>
      </div>
      
      {lastUpdated && (
        <div className="text-xs text-muted-foreground flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
          <span>数据来源: {platformName}</span>
          <span className="hidden md:inline">•</span> 
          <span>最后更新: {lastUpdated.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
} 