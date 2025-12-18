'use client';
import { useEffect, useMemo, useState } from "react";
import { PostMeta } from "@/lib/content";
import { BlogFilters } from "./filters";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  posts: PostMeta[];
  categories: string[];
  tags: string[];
}

const PAGE_SIZE = 6;

export function PostList({ posts, categories, tags }: Props) {
  const [filtered, setFiltered] = useState(posts);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(id);
  }, [filtered]);

  const visiblePosts = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  return (
    <div className="space-y-8">
      <BlogFilters
        categories={categories}
        tags={tags}
        posts={posts}
        onFiltered={(items) => {
          setFiltered(items);
          setVisible(PAGE_SIZE);
        }}
      />
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-72" />
          ))}
        </div>
      ) : (
        <>
          <motion.div
            layout
            id="son-yazilar"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            <AnimatePresence>
              {visiblePosts.map((post, idx) => (
                <PostCard key={post.slug} post={post} index={idx} />
              ))}
            </AnimatePresence>
          </motion.div>
          {visible < filtered.length && (
            <div className="flex justify-center pt-4">
              <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Daha fazla yükle
              </Button>
            </div>
          )}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground">Kriterlere uygun yazı bulunamadı.</p>
          )}
        </>
      )}
    </div>
  );
}
