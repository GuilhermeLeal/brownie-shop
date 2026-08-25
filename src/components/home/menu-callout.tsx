export function MenuCallout() {
  return (
    <section
      className="site-container py-20 sm:py-24 lg:py-28"
      aria-labelledby="menu-callout-title"
    >
      <div
        id="pedido"
        className="relative overflow-hidden rounded-[2.5rem] bg-secondary px-6 py-14 text-center sm:px-12 sm:py-16 lg:px-20"
      >
        <div
          className="absolute -right-16 -top-20 size-48 rounded-full bg-primary/60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-chocolate/65">
            Um doce para cada momento
          </p>
          <h2
            id="menu-callout-title"
            className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Conheça todos os nossos doces
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-7 text-chocolate/75">
            Descubra abaixo todas as opções disponíveis no nosso cardápio.
          </p>
          <a
            href="#cardapio"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-chocolate transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          >
            Ver cardápio completo
          </a>
        </div>
      </div>
    </section>
  );
}
