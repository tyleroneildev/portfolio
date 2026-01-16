import Link from "next/link";

import { getAllBlogs } from "@/lib/blog";

export default function Home() {
  const posts = getAllBlogs().slice(0, 3);

  return (
    <div className='min-h-screen px-8 pb-32 pt-24 sm:px-6'>
      <main className='mx-auto grid w-full max-w-225 gap-6'>
        <header className='grid gap-2'>
          <h1 className="font-['Instrument Serif'] text-[clamp(2.4rem,3vw,3.2rem)] tracking-[0.01em]">
            Tyler O&apos;Neil
          </h1>
          <p className='text-base tracking-[0.08em] text-[#a5a19a]'>
            Toronto, Ontario
          </p>
        </header>

        <ul className='grid list-none gap-2 pl-0 text-base text-[#f3f1ed]'>
          <li>software developer @ exchange solutions</li>
          <li>mcmaster btech software engineering</li>
          <li>
            building{" "}
            <Link
              className='border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-purple-300 hover:text-purple-300'
              href='https://nest.software'
              target='_blank'
              rel='noreferrer'
            >
              nest.software
            </Link>
          </li>
        </ul>

        <nav className='flex flex-wrap gap-3 text-[0.95rem]'>
          <Link
            className='border-b border-transparent pb-0.5 text-[#f3f1ed] transition-colors duration-200 hover:border-purple-300 hover:text-purple-300'
            href='https://github.com/tyleroneildev'
            target='_blank'
            rel='noreferrer'
          >
            github
          </Link>
          <Link
            className='border-b border-transparent pb-0.5 text-[#f3f1ed] transition-colors duration-200 hover:border-purple-300 hover:text-purple-300'
            href='https://www.linkedin.com/in/tyler-oneil-dev/'
            target='_blank'
            rel='noreferrer'
          >
            linkedin
          </Link>
          <Link
            className='border-b border-transparent pb-0.5 text-[#f3f1ed] transition-colors duration-200 hover:border-purple-300 hover:text-purple-300'
            href='/Tyler-Oneil-Resume.pdf'
          >
            resume
          </Link>
        </nav>

        <section>
          <h2 className='mb-2 text-[0.9rem] uppercase tracking-[0.08em] text-[#a5a19a]'>
            Blog
          </h2>
          <ul className='grid list-none gap-0 rounded-2xl border border-[#2a2a2a] bg-[#1b1b1b] p-0 text-[#f3f1ed]'>
            {posts.map((post) => (
              <li
                key={post.slug}
                className='group grid gap-2 border-b border-[#2a2a2a] px-5 py-4 last:border-b-0 sm:flex sm:items-center sm:justify-between'
              >
                <div className='grid gap-1'>
                  <Link
                    className='text-[1.05rem] font-medium text-[#c7a0ff] transition-colors duration-200 group-hover:text-[#e0c7ff]'
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
          <Link
            className='mt-3 inline-flex border-b border-transparent pb-0.5 text-sm text-[#a5a19a] transition-colors duration-200 hover:border-[#c7a0ff] hover:text-[#c7a0ff]'
            href='/blog'
          >
            view all posts →
          </Link>
        </section>
      </main>
    </div>
  );
}
