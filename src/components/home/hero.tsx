import Image from "next/image";

const gabiImage = "/images/gabi-leal.webp";

export function Hero() {
  return (
    <section
      id="inicio"
      className="site-container scroll-mt-6 pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32 lg:pt-16"
      aria-labelledby="hero-title"
    >
      <div
        id="sobre"
        className="grid scroll-mt-6 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <div className="max-w-xl">
          <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-chocolate shadow-sm ring-1 ring-chocolate/5">
            SOBRE A BROWNIERIA
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-balance font-heading text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
          >
            Por trás de cada brownie.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-chocolate/75 sm:text-lg sm:leading-8">
            Por trás da Brownieria Gabi Leal está a Gabi, que prepara cada
            brownie de forma artesanal e com cuidado em cada detalhe. A ideia é
            entregar aquele brownie com casquinha crocante por fora, macio e
            cremoso por dentro, feito para deixar qualquer momento um pouco mais
            gostoso.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#cardapio"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-chocolate transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Fazer pedido
            </a>
          </div>
        </div>

        <div className="relative isolate mx-auto w-full max-w-xl lg:mr-5 lg:max-w-[31.5rem]">
          <div
            className="absolute -inset-3 -z-10 rounded-[2.75rem] bg-primary sm:-inset-5"
            aria-hidden="true"
          />
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-secondary/20">
            <Image
              src={gabiImage}
              alt="Gabi Leal, responsável pela Brownieria Gabi Leal"
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover object-[52%_center]"
              preload
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
