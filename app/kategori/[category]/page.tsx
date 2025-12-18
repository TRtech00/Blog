import { PostCard } from "@/components/blog/post-card";
import { getAllCategories, getAllPosts } from "@/lib/content";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const posts = getAllPosts().filter((post) => post.categories.includes(params.category));
  if (!posts.length) return notFound();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Kategori</p>
        <h1 className="text-3xl font-semibold">{params.category}</h1>
        <p className="text-muted-foreground">Bu kategoride {posts.length} yazı var.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <PostCard key={post.slug} post={post} index={idx} />
        ))}
      </div>
    </div>
  );
}
