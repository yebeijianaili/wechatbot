import { NewsArticle } from './news-api';
import { Post } from '@/data/posts';

// 将新闻文章转换为博客文章格式
export function convertNewsToPost(article: NewsArticle): Post {
  // 从URL中创建一个slug
  const slug = article.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
  
  // 格式化日期
  const publishDate = new Date(article.publishedAt);
  const formattedDate = `${publishDate.getFullYear()}-${String(publishDate.getMonth() + 1).padStart(2, '0')}-${String(publishDate.getDate()).padStart(2, '0')}`;
  
  return {
    id: article.id,
    title: article.title,
    slug,
    date: formattedDate,
    excerpt: article.description,
    content: article.content,
    source: article.source.name,
    sourceUrl: article.url,
    imageUrl: article.urlToImage || '',
    score: article.score
  };
} 