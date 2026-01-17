'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { TocItem } from '@/lib/blog';

type TableOfContentsProps = {
  items: TocItem[];
};

export default function TableOfContents({ items }: TableOfContentsProps) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const [activeId, setActiveId] = useState(() => {
    if (typeof window === 'undefined') return ids[0] ?? '';
    const hashId = window.location.hash.replace('#', '');
    return ids.includes(hashId) ? hashId : (ids[0] ?? '');
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayedActiveId = ids.includes(activeId) ? activeId : (ids[0] ?? '');
  const activeIdRef = useRef(activeId);
  const collapsedRef = useRef(isCollapsed);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    collapsedRef.current = isCollapsed;
  }, [isCollapsed]);

  useEffect(() => {
    if (!ids.length) return;
    const handleHashChange = () => {
      const hashId = window.location.hash.replace('#', '');
      if (ids.includes(hashId)) {
        setActiveId(hashId);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [ids]);

  useEffect(() => {
    if (!items.length) return;

    const headingElements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (!headingElements.length) return;

    let animationFrame = 0;
    let offsets = headingElements.map((el) => ({
      id: el.id,
      top: el.getBoundingClientRect().top + window.scrollY
    }));
    const collapseThreshold = 20;
    const expandThreshold = 10;

    const updateActive = () => {
      animationFrame = 0;
      const scrollPosition = window.scrollY + 160;
      let currentId = offsets[0]?.id ?? '';
      for (const { id, top } of offsets) {
        if (top <= scrollPosition) {
          currentId = id;
        } else {
          break;
        }
      }
      if (currentId && currentId !== activeIdRef.current) {
        activeIdRef.current = currentId;
        setActiveId(currentId);
      }
      const pageHeight = document.documentElement.scrollHeight;
      const scrollBottom = window.scrollY + window.innerHeight;
      const distanceFromBottom = pageHeight - scrollBottom;
      let shouldCollapse = collapsedRef.current;
      if (collapsedRef.current) {
        if (distanceFromBottom > expandThreshold) shouldCollapse = false;
      } else if (distanceFromBottom <= collapseThreshold) {
        shouldCollapse = true;
      }
      if (shouldCollapse !== collapsedRef.current) {
        collapsedRef.current = shouldCollapse;
        setIsCollapsed(shouldCollapse);
      }
    };

    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateActive);
    };

    const handleResize = () => {
      offsets = headingElements.map((el) => ({
        id: el.id,
        top: el.getBoundingClientRect().top + window.scrollY
      }));
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [ids, items.length]);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', href);
    setActiveId(id);
  };

  return (
    <div
      aria-hidden={isCollapsed ? 'true' : undefined}
      className={[
        'rounded-2xl border border-[#2a2a2a] bg-[#1b1b1b] p-5 transition-opacity duration-300 ease-out',
        isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
      ].join(' ')}
    >
      <p className='text-xs tracking-[0.08em] text-[#a5a19a] uppercase'>On this page</p>
      <ul className='mt-4 grid gap-2 text-sm text-[#cfcac2]'>
        {items.map((item) => {
          const isActive = item.id === displayedActiveId;
          return (
            <li key={item.id} className={item.level === 3 ? 'pl-3' : undefined}>
              <a
                aria-current={isActive ? 'location' : undefined}
                className={[
                  'pb-0.5 transition-colors duration-200 lg:border-b',
                  isActive
                    ? 'border-transparent text-[#f3f1ed] lg:border-[#c7a0ff]'
                    : 'border-transparent lg:hover:border-[#c7a0ff] lg:hover:text-[#c7a0ff]'
                ].join(' ')}
                href={`#${item.id}`}
                onClick={handleLinkClick}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
