'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type TocItem = { id: string; title: string; level: number };

export function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="sticky top-28 hidden h-fit w-64 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-inner lg:block">
      <p className="text-sm font-semibold text-muted-foreground">İçindekiler</p>
      <nav className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              'block rounded-xl px-3 py-2 text-muted-foreground transition hover:text-primary',
              activeId === item.id && 'bg-primary/10 text-primary'
            )}
          >
            <span className={cn('inline-block', item.level === 3 && 'ml-4 text-xs')}>{item.title}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
