export type PostFrontmatter = {
  title: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  authorTitle: string;
  dateISO: string;
  updatedISO?: string;
  readingTime?: number;
  categories: string[];
  tags: string[];
  featured?: boolean;
  views?: number;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};
