'use client';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Linkedin, Share2, Twitter, Copy, MessageCircle } from "lucide-react";

export function ShareActions({ title }: { title: string }) {
  const toast = useToast();
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Bağlantı kopyalandı", description: "Arkadaşlarınla paylaş." });
  };

  const shareLinks = [
    {
      icon: <MessageCircle className="h-4 w-4" />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`
    },
    {
      icon: <Twitter className="h-4 w-4" />,
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" size="sm" onClick={copy}>
        <Copy className="mr-2 h-4 w-4" />Kopyala
      </Button>
      {shareLinks.map((item, idx) => (
        <Button key={idx} asChild variant="ghost" size="icon" aria-label="Paylaş">
          <a href={item.href} target="_blank" rel="noreferrer">
            {item.icon}
          </a>
        </Button>
      ))}
      <Share2 className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
