'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  categories: string[];
  tags: string[];
};

export function PostFilters({ categories, tags }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [localQuery, setLocalQuery] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [selectedTags, setSelectedTags] = useState<string[]>(params.get('tags')?.split(',').filter(Boolean) ?? []);
  const [featured, setFeatured] = useState(params.get('featured') === 'true');
  const [sort, setSort] = useState(params.get('sort') ?? 'new');

  useEffect(() => {
    const handler = setTimeout(() => applyFilters(), 450);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQuery, category, selectedTags, featured, sort]);

  const applyFilters = () => {
    const query = new URLSearchParams();
    if (localQuery) query.set('q', localQuery);
    if (category) query.set('category', category);
    if (selectedTags.length) query.set('tags', selectedTags.join(','));
    if (featured) query.set('featured', 'true');
    if (sort !== 'new') query.set('sort', sort);
    router.replace(`/blog?${query.toString()}`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border/60 bg-card/70 p-4 shadow-inner">
      <Input
        placeholder="Hızlı ara..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="w-full flex-1 min-w-[220px]"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="min-w-[160px] rounded-2xl border border-border bg-background px-3 py-2 text-sm shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Tüm Kategoriler</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            onClick={() => toggleTag(tag)}
            className={cn(
              'cursor-pointer border-border/70 bg-secondary text-secondary-foreground transition hover:border-primary hover:text-primary',
              selectedTags.includes(tag) && 'border-primary bg-primary/10 text-primary'
            )}
          >
            #{tag}
          </Badge>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
        />
        Öne çıkanlar
      </label>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="min-w-[150px] rounded-2xl border border-border bg-background px-3 py-2 text-sm shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="new">En yeni</option>
        <option value="popular">Popüler</option>
      </select>
      <Button variant="outline" onClick={applyFilters} className="rounded-2xl">
        Filtreyi uygula
      </Button>
    </div>
  );
}
