import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';
import { Post, PostFrontmatter } from './types';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

const frontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  coverImage: z.string(),
  authorName: z.string(),
  authorTitle: z.string(),
  dateISO: z.string(),
  updatedISO: z.string().optional(),
  readingTime: z.number().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  views: z.number().optional()
});

export function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();

  return slugs
    .map((slug) => {
      const fullPath = path.join(postsDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const parsed = frontmatterSchema.parse(data);
      const rt = parsed.readingTime ?? Math.ceil(readingTime(content).minutes);

      return {
        ...parsed,
        slug,
        content,
        readingTime: rt
      } satisfies Post;
    })
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const parsed = frontmatterSchema.parse(data);
  const rt = parsed.readingTime ?? Math.ceil(readingTime(content).minutes);
  return { ...parsed, slug, content, readingTime: rt } satisfies Post;
}

export function getAllCategories() {
  const posts = getAllPosts();
  return Array.from(new Set(posts.flatMap((p) => p.categories))).sort();
}

export function getAllTags() {
  const posts = getAllPosts();
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
}

export function getRelatedPosts(post: Post, limit = 3) {
  const posts = getAllPosts().filter((p) => p.slug !== post.slug);
  return posts
    .filter((p) => p.categories.some((c) => post.categories.includes(c)) || p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}
