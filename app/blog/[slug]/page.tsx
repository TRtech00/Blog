import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, RefreshCw } from "lucide-react";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/content";
import { ScrollProgress } from "@/components/blog/scroll-progress";
import { PostToc } from "@/components/blog/post-toc";
import { ShareActions } from "@/components/blog/share-actions";
import { BackToTop } from "@/components/blog/back-to-top";
import { RelatedPosts } from "@/components/blog/related-posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://example.com/blog/${post.slug}`,
      type: "article",
      images: [{ url: post.coverImage, alt: post.title }]
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return notFound();
  const related = getRelatedPosts(post.slug, post.categories, post.tags);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.dateISO,
    dateModified: post.updatedISO ?? post.dateISO,
    author: {
      "@type": "Person",
      name: post.authorName,
      jobTitle: post.authorTitle
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: "https://example.com/blog" },
      { "@type": "ListItem", position: 2, name: post.title, item: `https://example.com/blog/${post.slug}` }
    ]
  };

  return (
    <div className="space-y-12">
      <ScrollProgress />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-[1fr,280px]">
        <article className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="muted">
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{post.authorName}</span>
              <span>{post.authorTitle}</span>
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{post.dateFormatted}</span>
              {post.updatedISO && (
                <span className="inline-flex items-center gap-1"><RefreshCw className="h-4 w-4" />
                  {new Intl.DateTimeFormat("tr-TR", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.updatedISO))}
                </span>
              )}
              <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{post.readingTime}</span>
            </div>
            <ShareActions title={post.title} />
          </motion.div>
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/50"
            initial={{ opacity: 0.6, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={640}
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {post.source}
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Bülten</p>
                <h3 className="text-xl font-semibold">Ayda bir gelen, özenli ürün-UX notları</h3>
                <p className="text-muted-foreground">Spam yok. Tam kıvamında okuma listeleri.</p>
              </div>
              <Button size="lg" variant="default">Kayıt ol</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Yorumlar</h3>
            <p className="text-sm text-muted-foreground">Topluluk moderasyonlu yorumlar yakında. Saygılı ve yapıcı bir ton bekliyoruz.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">Örnek yorum kartı</div>
              <div className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">Soru-cevap alanı</div>
            </div>
          </div>
          <RelatedPosts posts={related} />
        </article>
        <PostToc toc={post.toc} />
      </div>
      <BackToTop />
    </div>
  );
}
