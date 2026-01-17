import fs from 'fs';
import path from 'path';

import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { ReactNode } from 'react';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import StockViewComparison from '@/components/blog/StockViewComparison';

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  date?: string;
};

export type BlogPost = BlogMeta & {
  content: ReactNode;
  toc: TocItem[];
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const mdxComponents = {
  StockViewComparison
};

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

function buildExcerpt(markdown: string) {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.replace(/^[#>*-\d.\s]+/, '').trim())
    .filter(Boolean);
  const sentence = lines.join(' ').replace(/\s+/g, ' ').trim();
  return sentence.slice(0, 160);
}

function extractToc(markdown: string) {
  const slugger = new GithubSlugger();
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,6})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      level: match[1].length,
      text: match[2].trim(),
      id: slugger.slug(match[2].trim())
    }));
}

function readPostFile(slug: string) {
  ensureBlogDir();
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { data, content };
}

export function getBlogSlugs() {
  ensureBlogDir();
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const postFile = readPostFile(slug);
  if (!postFile) return null;
  const { data, content } = postFile;
  const title = (data.title as string) || slug;
  const description = (data.description as string) || buildExcerpt(content);
  const toc = extractToc(content);

  const { content: compiledContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug]
      }
    }
  });

  return {
    slug,
    title,
    description,
    date: data.date as string | undefined,
    content: compiledContent,
    toc
  };
}

export function getAllBlogs(): BlogMeta[] {
  return getBlogSlugs()
    .flatMap((slug) => {
      const postFile = readPostFile(slug);
      if (!postFile) return [];
      const { data, content } = postFile;
      return [
        {
          slug,
          title: (data.title as string) || slug,
          description: (data.description as string) || buildExcerpt(content),
          date: data.date as string | undefined
        }
      ];
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title);
    });
}
