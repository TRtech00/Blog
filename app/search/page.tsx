import { PostCard } from '@/components/post-card';
import { SearchBar } from '@/components/search-bar';
import { getAllPosts } from '@/lib/posts';
import { Metadata } from 'next';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Arama',
  description: 'Blog yazıları içinde ara'
};

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q ?? '').toLowerCase();
  const results = getAllPosts().filter((p) =>
    [p.title, p.excerpt, p.tags.join(' '), p.categories.join(' ')].some((field) => field.toLowerCase().includes(query))
  );

  return (
    <main className="container space-y-6 pb-16 pt-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Arama</p>
        <h1 className="text-3xl font-bold">İçerikleri keşfedin</h1>
        <SearchBar />
      </div>
      {query && <p className="text-sm text-muted-foreground">{results.length} sonuç bulundu</p>}
      {results.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center text-muted-foreground">
          Sonuç bulunamadı.
        </div>
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {results.map((post, idx) => (
            <PostCard key={post.slug} post={post} index={idx} />
          ))}
        </motion.div>
      )}
    </main>
  );
}
