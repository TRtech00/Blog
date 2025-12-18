'use client';
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PostMeta } from "@/lib/content";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type SortOption = "new" | "popular";

interface FilterProps {
  categories: string[];
  tags: string[];
  posts: PostMeta[];
  onFiltered: (posts: PostMeta[]) => void;
}

export function BlogFilters({ categories, tags, posts, onFiltered }: FilterProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("new");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("category") ?? "all";
    const tg = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
    const featured = searchParams.get("featured") === "1";
    const sortParam = (searchParams.get("sort") as SortOption) ?? "new";
    setQuery(q);
    setCategory(cat);
    setSelectedTags(tg);
    setFeaturedOnly(featured);
    setSort(sortParam);
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = posts
        .filter((post) =>
          [post.title, post.excerpt, post.tags.join(" "), post.categories.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .filter((post) => (category === "all" ? true : post.categories.includes(category)))
        .filter((post) => (featuredOnly ? post.featured : true))
        .filter((post) =>
          selectedTags.length ? selectedTags.every((tag) => post.tags.includes(tag)) : true
        )
        .sort((a, b) => {
          if (sort === "popular") {
            return (b.views ?? 0) - (a.views ?? 0);
          }
          return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
        });
      onFiltered(filtered);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category !== "all") params.set("category", category);
      if (selectedTags.length) params.set("tags", selectedTags.join(","));
      if (featuredOnly) params.set("featured", "1");
      if (sort !== "new") params.set("sort", sort);
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query, category, selectedTags, featuredOnly, sort, posts, pathname, router, onFiltered]);

  const tagPills = useMemo(
    () =>
      tags.map((tag) => ({
        tag,
        active: selectedTags.includes(tag)
      })),
    [tags, selectedTags]
  );

  return (
    <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-5 shadow-lg">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Arama..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Yazı ara"
        />
        <Select
          options={[{ label: "Tüm kategoriler", value: "all" }, ...categories.map((c) => ({ label: c, value: c }))]}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Kategori seç"
        />
        <Select
          options={[
            { label: "En yeni", value: "new" },
            { label: "Popüler", value: "popular" }
          ]}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sıralama"
        />
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-2.5">
          <span className="text-sm font-medium">Öne çıkanlar</span>
          <Switch checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Etiket filtreleri">
        {tagPills.map(({ tag, active }) => (
          <Button
            key={tag}
            variant={active ? "default" : "secondary"}
            size="sm"
            className={cn("rounded-full", active && "shadow-glow")}
            onClick={() =>
              setSelectedTags((prev) =>
                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
              )
            }
          >
            #{tag}
          </Button>
        ))}
      </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Checkbox checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)}>
            Sadece öne çıkanlar
          </Checkbox>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setSelectedTags([]);
              setFeaturedOnly(false);
              setSort("new");
            }}
          >
            Sıfırla
          </Button>
        </div>
      </div>
  );
}
