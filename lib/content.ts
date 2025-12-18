import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { loadHighlighter, type Highlighter } from "shiki";
import type React from "react";
import { visit } from "unist-util-visit";

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorTitle: string;
  dateISO: string;
  updatedISO?: string;
  readingTime: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  views?: number;
  dateFormatted: string;
}

export interface PostData extends PostMeta {
  source: React.ReactElement;
  toc: { id: string; text: string; level: number }[];
}

const postsDirectory = path.join(process.cwd(), "content/posts");
let cachedHighlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!cachedHighlighter) {
    cachedHighlighter = await loadHighlighter({ theme: "github-dark" });
  }
  return cachedHighlighter;
}

export function getAllPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPostMeta(slug))
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}

export function getPostMeta(slug: string): PostMeta {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const time = readingTime(content).text;
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    content,
    coverImage: data.coverImage,
    authorName: data.authorName,
    authorTitle: data.authorTitle,
    dateISO: data.dateISO,
    updatedISO: data.updatedISO,
    readingTime: time,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    featured: Boolean(data.featured),
    views: data.views ?? Math.floor(Math.random() * 400 + 120),
    dateFormatted: new Intl.DateTimeFormat("tr-TR", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(data.dateISO))
  };
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  const meta = getPostMeta(slug);
  const toc: { id: string; text: string; level: number }[] = [];
  const highlighter = await getHighlighter();

  const { content } = await compileMDX<{ [key: string]: any }>(
    {
      source: meta.content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            () =>
              (tree: any) => {
                visit(tree, "element", (node: any) => {
                  if (node.tagName === "h2" || node.tagName === "h3") {
                    const id = node.properties?.id;
                    const text = node.children?.map((c: any) => c.value).join(" ") ?? "";
                    toc.push({ id, text, level: node.tagName === "h2" ? 2 : 3 });
                  }
                });
              },
            () =>
              async (tree: any) => {
                visit(tree, "element", (node: any) => {
                  if (node.tagName === "pre") {
                    const [codeEl] = node.children;
                    if (codeEl.tagName !== "code") return;
                    const language = codeEl.properties?.className?.[0]?.replace("language-", "") ?? "txt";
                    const code = codeEl.children?.[0]?.value ?? "";
                    const html = highlighter.codeToHtml(code, { lang: language });
                    node.properties = node.properties || {};
                    node.properties.dangerouslySetInnerHTML = { __html: html };
                    node.tagName = "div";
                  }
                });
              }
          ]
        }
      }
    }
  );

  return {
    ...meta,
    source: content,
    toc
  };
}

export function getAllCategories() {
  const posts = getAllPosts();
  const set = new Set<string>();
  posts.forEach((p) => p.categories.forEach((c) => set.add(c)));
  return Array.from(set);
}

export function getAllTags() {
  const posts = getAllPosts();
  const set = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set);
}

export function getRelatedPosts(slug: string, categories: string[], tags: string[]) {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .filter((p) => p.categories.some((c) => categories.includes(c)) || p.tags.some((t) => tags.includes(t)))
    .slice(0, 3);
}
