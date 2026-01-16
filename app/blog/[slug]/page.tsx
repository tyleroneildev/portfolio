import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogBySlug, getBlogSlugs } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Tyler O'Neil`,
    description: post.description,
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
    <div className="min-h-screen px-8 pb-32 pt-24 sm:px-6">
      <main className="mx-auto grid w-full max-w-225 gap-10">
        <Link
          className="text-sm uppercase tracking-[0.08em] text-[#a5a19a] transition-colors duration-200 hover:text-[#f3f1ed]"
          href="/blog"
        >
          ← Back to blog
        </Link>

        <header className="grid gap-3">
          <h1 className="font-['Instrument Serif'] text-[clamp(2.6rem,3.2vw,3.8rem)] tracking-[0.01em]">
            {post.title}
          </h1>
          <p className="max-w-2xl text-base text-[#cfcac2]">
            {post.description}
          </p>
          {post.date ? (
            <p className="text-sm uppercase tracking-[0.08em] text-[#a5a19a]">
              {post.date}
            </p>
          ) : null}
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <article className="blog-prose">{post.content}</article>
          {tocItems.length ? (
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-[#2a2a2a] bg-[#1b1b1b] p-5">
                <p className="text-xs uppercase tracking-[0.08em] text-[#a5a19a]">
                  On this page
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-[#cfcac2]">
                  {tocItems.map((item) => (
                    <li
                      key={item.id}
                      className={item.level === 3 ? "pl-3" : undefined}
                    >
                      <a
                        className="border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-[#c7a0ff] hover:text-[#c7a0ff]"
                        href={`#${item.id}`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </section>
      </main>
    </div>
  );
}
