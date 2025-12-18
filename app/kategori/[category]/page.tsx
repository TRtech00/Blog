import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllCategories, getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { motion } from 'framer-motion';

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const title = `${params.category} kategorisi`;
  return { title, description: `${title} için en güncel içerikler` };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const posts = getAllPosts().filter((p) => p.categories.includes(params.category));
  if (posts.length === 0) notFound();

  return (
    <main className="container space-y-6 pb-16 pt-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Kategori</p>
        <h1 className="text-3xl font-bold">{params.category}</h1>
      </div>
      <motion.div
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {posts.map((post, idx) => (
          <PostCard key={post.slug} post={post} index={idx} />
        ))}
      </motion.div>
    </main>
  );
}
