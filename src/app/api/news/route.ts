import { NextResponse } from 'next/server';
import { fetchLatestNews } from '@/lib/news-api';
import { convertNewsToPost } from '@/lib/news-converter';
import { addNewsPosts, getAllPosts } from '@/data/posts';

// 获取最新新闻的API路由
export async function GET(request: Request) {
  try {
    // 获取最新新闻
    const newsArticles = await fetchLatestNews('technology', 5);
    
    // 转换为博客文章格式
    const newPosts = newsArticles.map(convertNewsToPost);
    
    // 添加到现有文章中
    addNewsPosts(newPosts);
    
    // 返回所有文章，包括新添加的新闻
    const allPosts = getAllPosts();
    
    return NextResponse.json({ 
      success: true, 
      posts: allPosts,
      newsAdded: newPosts.length
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 