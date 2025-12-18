import { PostMeta } from "@/lib/content";
import { PostCard } from "./post-card";

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) return null;
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Daha fazlası</p>
        <h3 className="text-2xl font-semibold">Bunlar da ilgini çekebilir</h3>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <PostCard key={post.slug} post={post} index={idx} />
        ))}
      </div>
    </section>
  );
}
