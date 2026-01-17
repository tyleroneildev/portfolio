export default function BlogFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-[#2a2a2a] px-8 py-6 text-xs text-[#a5a19a] sm:px-6'>
      <div className='mx-auto flex w-full max-w-225 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <span>&copy; {year} Tyler O&apos;Neil</span>
        <div className='flex items-center gap-4'>
          <a
            aria-label="Tyler O'Neil on LinkedIn"
            className='transition-colors hover:text-[#f3f1ed]'
            href='https://www.linkedin.com/in/tyler-oneil-dev/'
            rel='noreferrer'
            target='_blank'
          >
            <svg aria-hidden='true' fill='currentColor' height='16' viewBox='0 0 24 24' width='16'>
              <path d='M4.98 3.5c0 1.38-1.11 2.5-2.48 2.5C1.1 6 0 4.88 0 3.5S1.1 1 2.5 1c1.37 0 2.48 1.12 2.48 2.5zM.2 23h4.6V7.7H.2V23zM8.5 7.7v15.3h4.6v-8.5c0-2.2.4-4.3 3.1-4.3 2.6 0 2.6 2.4 2.6 4.4V23h4.6v-9.3c0-4.6-1-8.1-6.4-8.1-2.6 0-4.3 1.4-5 2.7h-.1V7.7H8.5z' />
            </svg>
          </a>
          <a
            aria-label="Tyler O'Neil on GitHub"
            className='transition-colors hover:text-[#f3f1ed]'
            href='https://github.com/tyleroneildev'
            rel='noreferrer'
            target='_blank'
          >
            <svg aria-hidden='true' fill='currentColor' height='16' viewBox='0 0 24 24' width='16'>
              <path d='M12 .5C5.73.5.5 5.74.5 12.2c0 5.2 3.44 9.6 8.2 11.16.6.12.82-.27.82-.6v-2.2c-3.34.75-4.04-1.64-4.04-1.64-.55-1.45-1.35-1.84-1.35-1.84-1.1-.78.08-.77.08-.77 1.22.09 1.86 1.28 1.86 1.28 1.08 1.9 2.84 1.35 3.54 1.03.11-.8.42-1.35.76-1.66-2.66-.31-5.46-1.36-5.46-6.06 0-1.34.46-2.43 1.22-3.28-.12-.31-.53-1.57.12-3.28 0 0 1-.33 3.3 1.25.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.3-1.58 3.3-1.25 3.3-1.25.65 1.71.24 2.97.12 3.28.76.85 1.22 1.94 1.22 3.28 0 4.72-2.8 5.75-5.48 6.05.43.38.82 1.11.82 2.24v3.33c0 .33.22.72.82.6 4.76-1.56 8.2-5.96 8.2-11.16C23.5 5.74 18.27.5 12 .5z' />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
