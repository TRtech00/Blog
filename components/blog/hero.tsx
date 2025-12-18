import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BlogHero() {
  const blobs = [
    "bg-gradient-to-br from-primary/30 via-primary/5 to-transparent",
    "bg-gradient-to-br from-accent/30 via-accent/5 to-transparent",
    "bg-gradient-to-br from-sky-400/30 via-sky-300/10 to-transparent"
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-10 shadow-lg">
      <div className="absolute inset-0">
        {blobs.map((classes, idx) => (
          <motion.div
            key={idx}
            className={`absolute h-56 w-56 rounded-full blur-3xl ${classes}`}
            animate={{
              x: [0, idx % 2 === 0 ? 40 : -30, 0],
              y: [0, idx % 2 === 0 ? -30 : 30, 0]
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: idx * 0.6 }}
            style={{ left: `${20 + idx * 30}%`, top: `${10 + idx * 15}%` }}
          />
        ))}
      </div>
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 lg:max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Geleceğin blogu</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Modern UI/UX içgörüleri, teknoloji trendleri ve yaratıcı fikirler.
          </h1>
          <p className="text-lg text-muted-foreground">
            Mikro animasyonlardan büyük resme; üretken ve zevkli arayüzler inşa etmek için derinlemesine rehberler.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#son-yazilar">Son yazılar</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/search">Hızlı arama</Link>
            </Button>
          </div>
        </div>
        <div className="grid w-full max-w-sm grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-xl backdrop-blur">
          {["UI Animasyonu", "Strateji", "Performans", "Tipografi"].map((item, idx) => (
            <motion.div
              key={item}
              className="rounded-2xl border border-border/60 bg-card/80 p-4 text-sm font-semibold shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
