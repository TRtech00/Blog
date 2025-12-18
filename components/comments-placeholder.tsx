export function CommentsPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 p-6">
      <h3 className="text-lg font-semibold">Yorumlar</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Topluluğa saygılı olun. Yorumlar yayınlanmadan önce moderasyon sürecinden geçer.
      </p>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div className="rounded-xl border border-border/60 bg-background/60 p-3">Harika bir yazı, teşekkürler!</div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-3">Bu konu hakkında daha fazla örnek isterim.</div>
      </div>
    </div>
  );
}
