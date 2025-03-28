// 使用orz.ai的API获取实时新闻
// API文档: https://orz.ai/api/v1/dailynews

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
  score?: string;
};

// API响应数据类型
type NewsApiItem = {
  title: string;
  url: string;
  score: string;
  desc: string;
};

type NewsApiResponse = {
  status: string;
  data: NewsApiItem[];
  msg: string;
};

// 支持的平台列表
export const PLATFORMS = [
  'baidu',
  'zhihu',
  'weibo',
  'jinritoutiao',
  'bilibili',
  'douyin',
  'juejin',
  'douban',
  '36kr',
] as const;

export type NewsPlatform = typeof PLATFORMS[number];

const BASE_URL = 'https://orz.ai/api/v1/dailynews';

// 平台对应的显示名称
const PLATFORM_NAMES: Record<NewsPlatform, string> = {
  'baidu': '百度热搜',
  'zhihu': '知乎热榜',
  'weibo': '微博热搜',
  'jinritoutiao': '今日头条',
  'bilibili': 'B站热榜',
  'douyin': '抖音热点',
  'juejin': '掘金热榜',
  'douban': '豆瓣热榜',
  '36kr': '36氪热榜'
};

// 从平台名称获取合适的封面图
function getCoverImageForPlatform(platform: NewsPlatform): string {
  const images: Record<NewsPlatform, string> = {
    'baidu': 'https://img1.baidu.com/it/u=2180355917,3968563067&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    'zhihu': 'https://static.zhihu.com/heifetz/assets/apple-touch-icon-60.362a8eac.png',
    'weibo': 'https://n.sinaimg.cn/finance/350/w200h150/20181009/C190-hmhafiq8483273.png', 
    'jinritoutiao': 'https://sf1-cdn-tos.toutiaostatic.com/obj/artic-frontend/toutiao_web_pc/svgs/toutiao_logo.76db5ae.svg',
    'bilibili': 'https://i0.hdslb.com/bfs/archive/85cc1561ebf9cb239a7e42fb951be79823abe78c.jpg@672w_378h_1c_!web-search-common-cover.webp',
    'douyin': 'https://p3-pc.douyinpic.com/img/aweme-avatar/1000~c5_200x200.jpeg?from=2956013662',
    'juejin': 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/7abc2b532f725d394feaf0141547ade7.svg',
    'douban': 'https://img2.doubanio.com/view/subject/s/public/s1556748.jpg',
    '36kr': 'https://static.36krcdn.com/36kr-web/static/icon_36kr_512@2x.dd0facb2.png'
  };
  
  return images[platform] || '';
}

export async function fetchLatestNews(platform: NewsPlatform = 'jinritoutiao', limit: number = 10): Promise<NewsArticle[]> {
  try {
    // 发送请求获取实时新闻
    const response = await fetch(`${BASE_URL}/?platform=${platform}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news from ${platform}, status: ${response.status}`);
    }
    
    const data = await response.json() as NewsApiResponse;
    
    if (data.status !== "200" || !Array.isArray(data.data)) {
      throw new Error(`Invalid response from API: ${JSON.stringify(data)}`);
    }
    
    // 转换API返回的数据为我们需要的格式
    const articles: NewsArticle[] = data.data.slice(0, limit).map((item: NewsApiItem, index: number) => {
      const platformName = PLATFORM_NAMES[platform] || platform;
      const currentDate = new Date().toISOString();
      
      // 为文章生成内容
      const content = `
# ${item.title}

${item.desc || `这是一条来自${platformName}的热门话题，当前热度为 ${item.score || '很高'}。`}

## 热度

当前热度: ${item.score || '未知'}

## 来源

此内容来自${platformName}，您可以点击[原文链接](${item.url})查看更多信息。
      `;
      
      return {
        id: `${platform}-${index}-${Date.now()}`,
        title: item.title,
        description: item.desc || `来自${platformName}的热门话题`,
        content,
        url: item.url,
        urlToImage: getCoverImageForPlatform(platform),
        publishedAt: currentDate,
        source: {
          name: platformName
        },
        score: item.score
      };
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
} 