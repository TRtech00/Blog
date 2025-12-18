import { motion } from 'framer-motion';
import { SearchBar } from './search-bar';

export function BlogHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background p-10 shadow-soft">
      <div className="absolute -left-20 -top-32 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      <motion.div
        className="absolute right-12 top-8 h-16 w-16 rounded-full bg-white/10"
        animate={{ y: [0, -10, 0], x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-12 bottom-6 h-24 w-24 rounded-full bg-indigo-400/10"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
      <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Future-ready editorial</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">Kusursuz deneyimlerle tasarlanmış modern blog</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Hareketli etkileşimler, kusursuz karanlık mod ve premium tipografi ile hazırlanmış yeni nesil içerik deneyimi.
          </p>
        </div>
        <div className="relative">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
