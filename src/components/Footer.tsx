export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-6">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © Orbitfolio 2026 · ETHPrague Hackathon
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
