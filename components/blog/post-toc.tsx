'use client';
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function PostToc({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = toc.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 1.0] }
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  const items = useMemo(() => toc, [toc]);

  if (!items.length) return null;

  return (
    <aside className="sticky top-28 hidden max-h-[70vh] min-w-[240px] max-w-xs overflow-auto rounded-2xl border border-border/60 bg-card/60 p-4 shadow-lg lg:block">
      <div className="text-sm font-semibold text-muted-foreground">İçindekiler</div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && "ml-3")}>
            <Link
              href={`#${item.id}`}
              className={cn(
                "block rounded-xl px-2 py-1 transition hover:bg-muted",
                activeId === item.id && "bg-primary/10 text-primary"
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
