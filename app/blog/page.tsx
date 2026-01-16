import Link from "next/link";
import type { Metadata } from "next";

import { getAllBlogs } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Tyler O'Neil",
  description: "Writing about software, finance, and building products.",
};

export default function BlogIndexPage() {
  const posts = getAllBlogs();

  return (
    <div className='min-h-screen px-8 pb-32 pt-24 sm:px-6'>
      <main className='mx-auto grid w-full max-w-225 gap-10'>
        <header className='grid gap-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-[0.9rem] uppercase tracking-[0.08em] text-[#a5a19a]'>
              Blog
            </p>
            <Link
              className='text-sm uppercase tracking-[0.08em] text-[#a5a19a] transition-colors duration-200 hover:text-[#f3f1ed]'
              href='/'
            >
              ← Back to home
            </Link>
          </div>
          <h1 className="font-['Instrument Serif'] text-[clamp(2.6rem,3.2vw,3.6rem)] tracking-[0.01em]">
            Writing about software, finance, and building products.
          </h1>
          <p className='max-w-2xl text-base text-[#cfcac2]'>
            A collection of personal notes.
          </p>
        </header>

        <section className='grid gap-4'>
          <ul className='grid list-none gap-0 rounded-2xl border border-[#2a2a2a] bg-[#1b1b1b] p-0'>
            {posts.map((post) => (
              <li
                key={post.slug}
                className='group grid gap-2 border-b border-[#2a2a2a] px-6 py-5 last:border-b-0 sm:flex sm:items-center sm:justify-between'
              >
                <div className='grid gap-2'>
                  <Link
                    className='text-[1.15rem] font-medium text-[#c7a0ff] transition-colors duration-200 group-hover:text-[#e0c7ff]'
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                  <p className='text-sm text-[#a5a19a]'>{post.description}</p>
                </div>
                <span className='text-xl text-[#4b4b4b] transition-colors duration-200 group-hover:text-[#c7a0ff]'>
                  →
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
