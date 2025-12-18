import { BlogHero } from '@/components/blog-hero';
import { PostCard } from '@/components/post-card';
import { PostFilters } from '@/components/post-filters';
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/lib/utils';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Blog',
  description: siteConfig.description
};

function filterPosts(searchParams: Record<string, string | string[] | undefined>) {
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const tagsParam = typeof searchParams.tags === 'string' ? searchParams.tags.split(',').filter(Boolean) : [];
  const featured = searchParams.featured === 'true';
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'new';

  let posts = getAllPosts();

  if (query) {
    posts = posts.filter((p) =>
      [p.title, p.excerpt, p.tags.join(' '), p.categories.join(' ')].some((field) => field.toLowerCase().includes(query))
    );
  }
  if (category) posts = posts.filter((p) => p.categories.includes(category));
  if (tagsParam.length) posts = posts.filter((p) => tagsParam.every((t) => p.tags.includes(t)));
  if (featured) posts = posts.filter((p) => p.featured);
  if (sort === 'popular') posts = posts.slice().sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

  return posts;
}

function Listing({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const posts = filterPosts(searchParams);
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="space-y-8">
      <PostFilters categories={categories} tags={tags} />
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center text-muted-foreground">
          Aradığınız kriterlere uygun yazı bulunamadı.
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default function BlogPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <main className="container space-y-10 pb-16 pt-8">
      <BlogHero />
      <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-muted" />}>
        <Listing searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
