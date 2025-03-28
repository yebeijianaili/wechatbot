import { NextResponse } from 'next/server';
import { fetchLatestNews, PLATFORMS, NewsPlatform } from '@/lib/news-api';
import { convertNewsToPost } from '@/lib/news-converter';
import { addNewsPosts, getAllPosts } from '@/data/posts';

// 获取最新新闻的API路由
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // 从查询参数获取平台，默认为jinritoutiao
    const platformParam = url.searchParams.get('platform') || 'jinritoutiao';
    // 确保使用有效的平台
    const platform = PLATFORMS.includes(platformParam as NewsPlatform) 
      ? platformParam as NewsPlatform 
      : 'jinritoutiao';
    
    // 从查询参数获取限制数量，默认为10
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    // 获取最新新闻
    const newsArticles = await fetchLatestNews(platform, limit);
    
    // 转换为博客文章格式
    const newPosts = newsArticles.map(convertNewsToPost);
    
    // 添加到现有文章中
    addNewsPosts(newPosts);
    
    // 返回所有文章，包括新添加的新闻
    const allPosts = getAllPosts();
    
    return NextResponse.json({ 
      success: true, 
      posts: allPosts,
      newsAdded: newPosts.length,
      platform,
      platformName: newsArticles.length > 0 ? newsArticles[0].source.name : platform,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 