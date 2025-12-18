'use client';

import { Button } from './ui/button';
import { Link2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const shareLinks = (url: string, title: string) => [
  { name: 'X', href: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
  { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
  { name: 'WhatsApp', href: `https://wa.me/?text=${title}%20${url}` }
];

export function ShareActions({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={copyLink} className="rounded-xl">
        <Link2 className="mr-2 h-4 w-4" /> {copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}
      </Button>
      {shareLinks(url, title).map((item) => (
        <motion.a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
          whileTap={{ scale: 0.97 }}
        >
          <Share2 className="mr-2 inline h-4 w-4" /> {item.name}
        </motion.a>
      ))}
    </div>
  );
}
