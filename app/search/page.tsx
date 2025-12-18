import { Input } from "@/components/ui/input";
import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/blog/post-card";
import { Suspense } from "react";
import { SearchIcon } from "lucide-react";

export const dynamic = "force-static";

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.toLowerCase() ?? "";
  const posts = getAllPosts().filter((post) =>
    [post.title, post.excerpt, post.tags.join(" "), post.categories.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-lg">
          <SearchIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Arama</p>
          <h1 className="text-3xl font-semibold">Blog'da ara</h1>
          <p className="text-muted-foreground">Başlık, özet, etiket ya da kategori ile arat.</p>
        </div>
      </div>
      <form className="rounded-3xl border border-border/60 bg-card/80 p-4 shadow-lg" action="/search">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Animasyon, UX, Next.js..."
          aria-label="Arama"
        />
      </form>
      <Suspense fallback={<p>Yükleniyor...</p>}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, idx) => (
            <PostCard key={post.slug} post={post} index={idx} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-muted-foreground">Aradığın kriterlere uygun sonuç bulunamadı.</p>
        )}
      </Suspense>
    </div>
  );
}
