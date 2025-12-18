import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'framer-motion';

export function NewsletterCta() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-background p-8 shadow-soft"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute -left-10 top-4 h-24 w-24 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -right-6 bottom-2 h-20 w-20 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Bültene katılın</h3>
          <p className="text-sm text-muted-foreground max-w-xl">
            Yeni yazılar, deneyimler ve kürasyonlu linkler aylık olarak e-posta kutunuzda. Spam yok, sadece ilham.
          </p>
        </div>
        <form className="flex w-full max-w-md flex-col gap-3 md:flex-row">
          <Input placeholder="E-posta adresi" type="email" required className="bg-background/80" />
          <Button className="rounded-2xl">Abone ol</Button>
        </form>
      </div>
    </motion.div>
  );
}
