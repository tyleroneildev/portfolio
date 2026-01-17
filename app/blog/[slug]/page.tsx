import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import TableOfContents from '@/components/blog/TableOfContents';
import { getBlogBySlug, getBlogSlugs } from '@/lib/blog';
import { formatBlogDate } from '@/lib/utils/date';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Tyler O'Neil`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://tyleroneil.dev/blog/${post.slug}`,
      siteName: "Tyler O'Neil",
      type: 'article',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(
            post.description
          )}&type=Blog`,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [
        `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.description)}&type=Blog`
      ]
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) {
    notFound();
  }

  const tocItems = post.toc.filter((item) => item.level <= 3);

  return (
    <div className='px-8 pt-24 pb-40 sm:px-6'>
      <main className='mx-auto grid w-full max-w-225 gap-10'>
        <Link
          className='text-sm tracking-[0.08em] text-[#a5a19a] uppercase transition-colors duration-200 hover:text-[#f3f1ed]'
          href='/blog'
        >
          ← Back to blog
        </Link>

        <header className='grid gap-3'>
          <h1 className="font-['Instrument Serif'] text-[clamp(2.6rem,3.2vw,3.8rem)] tracking-[0.01em]">
            {post.title}
          </h1>
          <p className='max-w-2xl text-base text-[#cfcac2]'>{post.description}</p>
          {post.date ? (
            <p className='text-sm tracking-[0.08em] text-[#a5a19a] uppercase'>{formatBlogDate(post.date)}</p>
          ) : null}
        </header>

        <section className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]'>
          {tocItems.length ? (
            <aside className='order-1 lg:sticky lg:top-24 lg:order-2 lg:max-h-[calc(100vh-6rem)] lg:self-start'>
              <TableOfContents items={tocItems} />
            </aside>
          ) : null}
          <article className='blog-prose order-2 lg:order-1'>{post.content}</article>
        </section>
      </main>
    </div>
  );
}
