export type Post = {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  excerpt: string;
  source?: string;
  sourceUrl?: string;
  imageUrl?: string;
  score?: string;
};

// 在内存中保存动态添加的新闻文章
let newsArticles: Post[] = [];

export const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    slug: 'getting-started-with-nextjs',
    date: '2024-03-27',
    excerpt: 'Learn the basics of Next.js and start building your first application.',
    content: `
# Getting Started with Next.js

Next.js is a React framework that gives you building blocks to create web applications.

## Why Next.js?

Next.js simplifies the process of building a React application by providing:

- Server-side rendering
- Static site generation
- API routes
- Built-in CSS and Sass support
- Fast refresh
- TypeScript support
- File-based routing

## Installation

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## Basic Concepts

Next.js uses a file-based routing system. Files in the \`app\` directory automatically become routes.
    `
  },
  {
    id: '2',
    title: 'Building a Blog with Next.js',
    slug: 'building-a-blog-with-nextjs',
    date: '2024-03-28',
    excerpt: 'Create a fully-featured blog using Next.js and TypeScript.',
    content: `
# Building a Blog with Next.js

In this tutorial, we'll create a blog using Next.js from scratch.

## Project Structure

A good blog structure might look like:

\`\`\`
/app
  /blog
    /[slug]
      page.tsx
    page.tsx
  page.tsx
  layout.tsx
/components
  BlogCard.tsx
  Header.tsx
  Footer.tsx
/data
  posts.ts
\`\`\`

## Creating Blog Posts

You can store blog posts as markdown files, or in a database, or even as data files like we're doing in this example.

## Displaying Posts

Use the \`map\` function to display multiple blog posts on your homepage.
    `
  },
  {
    id: '3',
    title: 'Advanced Next.js Features',
    slug: 'advanced-nextjs-features',
    date: '2024-03-29',
    excerpt: 'Explore advanced features of Next.js like API routes, ISR, and more.',
    content: `
# Advanced Next.js Features

Once you're comfortable with the basics of Next.js, you can explore its more advanced features.

## API Routes

Next.js allows you to create API endpoints easily using the \`app/api\` directory.

## Image Optimization

Next.js includes an Image component that optimizes images for performance.

## Incremental Static Regeneration (ISR)

ISR allows you to update static pages after you've built your site.

## Middleware

Middleware lets you run code before a request is completed.

## Authentication

You can implement authentication using various libraries like NextAuth.js.
    `
  }
];

export function getPostBySlug(slug: string): Post | undefined {
  return [...posts, ...newsArticles].find((post) => post.slug === slug);
}

export function getAllPosts(): Post[] {
  return [...posts, ...newsArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 添加从新闻API获取的文章
export function addNewsPosts(newPosts: Post[]): void {
  // 过滤掉已存在的文章（根据ID）
  const existingIds = new Set([...posts, ...newsArticles].map(post => post.id));
  const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
  
  // 添加到新闻文章列表
  newsArticles = [...uniqueNewPosts, ...newsArticles];
  
  // 限制最多保存20篇新闻文章，避免内存占用过多
  if (newsArticles.length > 20) {
    newsArticles = newsArticles.slice(0, 20);
  }
} 