import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedISO ?? post.dateISO
  }));

  return [
    { url: `${siteConfig.url}/blog`, lastModified: new Date() },
    ...posts
  ];
}
