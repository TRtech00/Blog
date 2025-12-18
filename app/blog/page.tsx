import { BlogHero } from "@/components/blog/hero";
import { PostList } from "@/components/blog/post-list";
import { getAllCategories, getAllPosts, getAllTags } from "@/lib/content";

export const dynamic = "force-static";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="space-y-10">
      <BlogHero />
      <PostList posts={posts} categories={categories} tags={tags} />
    </div>
  );
}
