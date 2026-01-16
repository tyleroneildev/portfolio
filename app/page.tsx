import Link from "next/link";

export default function Home() {
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
          <li>currently: software developer @ exchange solutions</li>
          <li>
            building:{" "}
            <Link
              className='border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-purple-300 hover:text-purple-300'
              href='https://nest.software'
              target='_blank'
              rel='noreferrer'
            >
              nest (personal finance saas)
            </Link>{" "}
          </li>
          <li>education: mcmaster btech software engineering</li>
          <li>interests: fintech, personal finance, investing</li>
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
            Selected Work
          </h2>
          <ul className='grid list-none gap-2 p-0 text-[#f3f1ed]'>
            <li>Nest → short 1-line description</li>
            <li>Duordle → short 1-line description</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
