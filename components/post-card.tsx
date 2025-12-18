import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Post } from '@/lib/types';

export function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-soft backdrop-blur"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.15 }}
            >
              <Badge className="bg-primary/10 text-primary shadow-none">#{tag}</Badge>
            </motion.div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-tight tracking-tight">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="space-x-2">
            <span>{post.authorName}</span>
            <span>•</span>
            <span>{new Date(post.dateISO).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{post.readingTime} dk okuma</span>
          </div>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-semibold text-primary transition hover:translate-x-1"
        >
          Devamını oku →
        </Link>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-x-8 bottom-10 h-24 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-3xl" />
      </div>
    </motion.article>
  );
}
