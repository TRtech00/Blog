'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/kategori/teknoloji', label: 'Kategori' },
  { href: '/search', label: 'Search' }
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/80">
      <div className="container flex items-center gap-6 py-4">
        <Link href="/blog" className="text-lg font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Nebula</span> Blog
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <div key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={cn('rounded-lg px-3 py-2 transition hover:text-primary', active && 'text-primary')}
                >
                  {link.label}
                </Link>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="active-underline"
                      className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
