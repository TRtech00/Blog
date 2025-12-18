import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/posts';
import { mdxComponents } from '@/components/mdx-components';
import { siteConfig } from '@/lib/utils';
import { Toc, type TocItem } from '@/components/toc';
import { ScrollProgress } from '@/components/scroll-progress';
import { ShareActions } from '@/components/share-actions';
import { NewsletterCta } from '@/components/newsletter-cta';
import { CommentsPlaceholder } from '@/components/comments-placeholder';
import { BackToTop } from '@/components/back-to-top';
import { PostCard } from '@/components/post-card';
import Image from 'next/image';

function buildToc(raw: string): TocItem[] {
  const lines = raw.split('\n');
  const headers: TocItem[] = [];
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.*)/.exec(line.trim());
    if (match) {
      const level = match[1].length;
      const title = match[2].replace(/`/g, '');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      headers.push({ id, title, level });
    }
  }
  return headers;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      images: [post.coverImage]
    }
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const toc = buildToc(post.content);
  const { content } = await compileMDX<{ frontmatter: any }>({
    source: post.content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: false
            }
          ]
        ]
      }
    }
  });

  const related = getRelatedPosts(post);
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Blog',
      item: `${siteConfig.url}/blog`
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: post.title,
      item: `${siteConfig.url}/blog/${post.slug}`
    }
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: [post.coverImage],
    author: { '@type': 'Person', name: post.authorName },
    datePublished: post.dateISO,
    dateModified: post.updatedISO ?? post.dateISO,
    url: `${siteConfig.url}/blog/${post.slug}`,
    description: post.excerpt
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
  };

  return (
    <>
      <ScrollProgress />
      <main className="container relative pb-16 pt-8">
        <article className="grid gap-10 lg:grid-cols-[1fr,280px]">
          <div className="space-y-10">
            <header className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-primary">{post.categories.join(' / ')}</p>
                <h1 className="text-4xl font-bold leading-tight tracking-tight">{post.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 rounded-full border border-border/70 px-4 py-2">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                  <div>
                    <p className="font-semibold text-foreground">{post.authorName}</p>
                    <p>{post.authorTitle}</p>
                  </div>
                </div>
                <span>· {new Date(post.dateISO).toLocaleDateString()}</span>
                <span>· {post.readingTime} dk okuma</span>
                {post.updatedISO && <span>· Güncellendi {new Date(post.updatedISO).toLocaleDateString()}</span>}
              </div>
              <ShareActions url={`${siteConfig.url}/blog/${post.slug}`} title={post.title} />
              <div className="relative overflow-hidden rounded-3xl border border-border/70">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1600}
                  height={900}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
            </header>
            <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
              {content}
            </div>
            <NewsletterCta />
            <CommentsPlaceholder />
          </div>
          <div className="space-y-6">
            <Toc items={toc} />
          </div>
        </article>
        {related.length > 0 && (
          <section className="mt-14 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Benzer yazılar</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((post, idx) => (
                <PostCard key={post.slug} post={post} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>
      <BackToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
