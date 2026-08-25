export function Footer() {
  return (
    <footer className="bg-chocolate text-white">
      <div className="site-container py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="font-heading text-2xl font-bold">Brownies &amp; Doces</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
              Um cantinho para doces feitos com cuidado e carinho.
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm font-semibold">Redes e contato</p>
            <p className="mt-2 text-sm text-white/65">
              Espaço reservado para Instagram e WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Brownies &amp; Doces.
          </p>
        </div>
      </div>
    </footer>
  );
}
