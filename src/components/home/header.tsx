const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Cardápio", href: "#cardapio" },
  { label: "Sobre", href: "#sobre" },
];

const navigationLinkStyles =
  "rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Header() {
  return (
    <>
      <a
        href="#conteudo-principal"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-chocolate px-4 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Pular para o conteúdo
      </a>

      <header className="relative z-50 bg-background">
        <div className="site-container flex min-h-20 items-center justify-between gap-6 py-4">
          <a
            href="#inicio"
            className="inline-flex items-center gap-2 rounded-full font-heading text-xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:text-2xl"
            aria-label="Brownies & Doces — início"
          >
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            Brownies &amp; Doces
          </a>

          <div className="hidden items-center gap-3 md:flex">
            <nav
              className="flex items-center gap-1 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-chocolate/5"
              aria-label="Navegação principal"
            >
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={navigationLinkStyles}
                  aria-current={item.href === "#inicio" ? "page" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href="#pedido"
              className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-chocolate transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Fazer pedido
            </a>
          </div>

          <details className="group relative md:hidden">
            <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full bg-white text-chocolate shadow-sm ring-1 ring-chocolate/10 transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Abrir ou fechar menu de navegação</span>
              <svg
                className="size-5 group-open:hidden"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <svg
                className="hidden size-5 group-open:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </summary>

            <nav
              className="absolute right-0 top-14 w-64 rounded-3xl bg-white p-3 shadow-lg ring-1 ring-chocolate/10"
              aria-label="Navegação móvel"
            >
              <div className="flex flex-col">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-4 py-3 font-semibold transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate"
                    aria-current={item.href === "#inicio" ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#pedido"
                  className="mt-2 rounded-2xl bg-primary px-4 py-3 text-center font-bold transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate"
                >
                  Fazer pedido
                </a>
              </div>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
