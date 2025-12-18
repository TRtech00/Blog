import { PostCard } from "@/components/blog/post-card";
import { getAllPosts, getAllTags } from "@/lib/content";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const posts = getAllPosts().filter((post) => post.tags.includes(params.tag));
  if (!posts.length) return notFound();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Etiket</p>
        <h1 className="text-3xl font-semibold">#{params.tag}</h1>
        <p className="text-muted-foreground">Bu etiketle {posts.length} yazı bulundu.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <PostCard key={post.slug} post={post} index={idx} />
        ))}
      </div>
    </div>
  );
}
