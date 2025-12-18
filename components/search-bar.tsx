'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [query, setQuery] = useState(initial);

  useEffect(() => setQuery(initial), [initial]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      className="group relative flex items-center gap-3 rounded-3xl border border-border/70 bg-background/80 p-2 shadow-glow"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yazı, kategori veya etiket ara..."
          className="border-none bg-transparent text-base shadow-none focus-visible:ring-0"
        />
      </div>
      <Button type="submit" size="lg" className="rounded-2xl">
        <Search className="mr-2 h-4 w-4" /> Ara
      </Button>
    </motion.form>
  );
}
