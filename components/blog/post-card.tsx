'use client';
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PostMeta } from "@/lib/content";
import { Calendar, Clock3 } from "lucide-react";

export function PostCard({ post, index }: { post: PostMeta; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <Card className="overflow-hidden border-border/70 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/10">
          <div className="relative h-56 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.05] group-hover:brightness-105"
              sizes="(min-width: 1024px) 400px, 100vw"
              priority={index < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="muted"
                  className="translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{post.dateFormatted}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{post.readingTime}</span>
            </div>
            <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {post.categories.map((category) => (
                <span key={category} className="rounded-full bg-muted px-3 py-1">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
