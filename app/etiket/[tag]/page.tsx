import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { motion } from 'framer-motion';

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  const title = `${params.tag} etiketi`;
  return { title, description: `${title} ile ilgili yazılar` };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const posts = getAllPosts().filter((p) => p.tags.includes(params.tag));
  if (posts.length === 0) notFound();

  return (
    <main className="container space-y-6 pb-16 pt-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Etiket</p>
        <h1 className="text-3xl font-bold">#{params.tag}</h1>
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
