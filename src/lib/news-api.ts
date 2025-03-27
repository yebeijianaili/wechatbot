// 这里使用NewsAPI示例（在生产环境中，您需要申请真实的API密钥）
// 申请地址：https://newsapi.org/

export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
};

const API_KEY = process.env.NEWS_API_KEY || 'demo-api-key';
const BASE_URL = 'https://newsapi.org/v2';

export async function fetchLatestNews(category: string = 'technology', pageSize: number = 10): Promise<NewsArticle[]> {
  try {
    // 在真实环境中，使用下面的代码获取数据
    // const response = await fetch(
    //   `${BASE_URL}/top-headlines?category=${category}&pageSize=${pageSize}&language=en&apiKey=${API_KEY}`
    // );
    // if (!response.ok) throw new Error('Failed to fetch news');
    // const data = await response.json();
    // return data.articles.map((article: any, index: number) => ({
    //   id: `news-${index}-${Date.now()}`,
    //   ...article
    // }));

    // 为了演示，使用模拟数据
    return getMockNewsData();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// 模拟新闻数据（实际使用时请替换为真实API调用）
function getMockNewsData(): NewsArticle[] {
  const currentDate = new Date().toISOString();
  
  return [
    {
      id: `news-1-${Date.now()}`,
      title: 'Next.js 15发布：带来了惊人的性能提升',
      description: 'Vercel发布了Next.js 15，带来了更快的构建时间和新的开发者体验改进。',
      content: `
# Next.js 15发布：带来了惊人的性能提升

Vercel最近发布了Next.js的最新版本，提供了更快的Rust编译器和改进的开发者体验。

## 主要特性：

- Turbopack: 基于Rust的新打包工具，比webpack快700倍
- 服务器组件: 默认启用React服务器组件
- 更快的构建时间: 静态和动态内容生成速度更快
- 改进的图像组件: 更好的性能和可访问性

Next.js 15是框架有史以来最大的性能升级之一，用户报告开发环境热重载时间缩短了50%以上。
      `,
      url: 'https://nextjs.org/blog/next-15',
      urlToImage: 'https://nextjs.org/static/blog/next-15/twitter-card.png',
      publishedAt: currentDate,
      source: {
        name: 'Next.js Blog'
      }
    },
    {
      id: `news-2-${Date.now()}`,
      title: 'React 19引入新的渲染模型',
      description: 'React团队宣布了即将推出的React 19版本中的渲染改进。',
      content: `
# React 19引入新的渲染模型

React团队最近宣布了React 19的发布，其中包含许多令人兴奋的新特性和改进。

## 亮点：

- 资源加载：新的资源加载APIs
- 改进的服务器组件：更好的错误处理和数据获取
- 内置缓存：组件级缓存改进
- 更快的并发渲染：进一步优化React并发模式

这些变化将使开发者能够构建更快速、更具响应性的应用程序，同时保持对现有React应用的向后兼容性。
      `,
      url: 'https://react.dev/blog/2023/03/22/react-19',
      urlToImage: 'https://react.dev/images/og-home.png',
      publishedAt: currentDate,
      source: {
        name: 'React Blog'
      }
    },
    {
      id: `news-3-${Date.now()}`,
      title: 'Tailwind CSS v4.0发布',
      description: 'Tailwind CSS v4.0包含引擎盖下的完全重写，具有更好的性能。',
      content: `
# Tailwind CSS v4.0发布

Tailwind Labs发布了Tailwind CSS的主要新版本，带来了巨大的性能改进和新功能。

## 新特性：

- 使用Lightning CSS进行更快的构建
- 改进的JIT引擎，提供更快的开发体验
- 新的动画实用工具
- 更好的深色模式支持
- 更小的生产构建包大小

Tailwind CSS v4.0是该库有史以来性能最好的版本，在大型项目中构建时间减少了高达80%。
      `,
      url: 'https://tailwindcss.com/blog/tailwindcss-v4',
      urlToImage: 'https://tailwindcss.com/img/tailwind-twitter-card.jpg',
      publishedAt: currentDate,
      source: {
        name: 'Tailwind CSS Blog'
      }
    }
  ];
} 