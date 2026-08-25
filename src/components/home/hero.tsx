"use client";

import Image from "next/image";

import { useOrderMode } from "@/contexts/order-mode-context";

// Imagem temporária: substitua este caminho pela fotografia final do Hero.
const heroImage = "/images/demo/demo-hero-brownies.png";

export function Hero() {
  const { isOrderMode, startOrderMode } = useOrderMode();

  return (
    <section
      id="inicio"
      className="site-container scroll-mt-6 pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-32 lg:pt-16"
      aria-labelledby="hero-title"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-chocolate shadow-sm ring-1 ring-chocolate/5">
            Brownies artesanais
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-balance font-heading text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
          >
            Carinho em cada pedaço.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-chocolate/75 sm:text-lg sm:leading-8">
            Texto provisório para apresentar brownies feitos de forma artesanal,
            com cuidado nos detalhes e sabor para deixar o dia mais doce.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#cardapio"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-chocolate transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver cardápio
            </a>
            <button
              type="button"
              onClick={startOrderMode}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-chocolate/20 bg-white px-6 py-3 font-bold text-chocolate transition-colors hover:border-secondary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isOrderMode ? "Continuar pedido" : "Fazer pedido"}
            </button>
          </div>
        </div>

        <div className="relative isolate mx-auto w-full max-w-xl">
          <div
            className="absolute -inset-3 -z-10 rounded-[2.75rem] bg-secondary/30 sm:-inset-5"
            aria-hidden="true"
          />
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-secondary/20">
            <Image
              src={heroImage}
              alt="Imagem temporária de brownies artesanais empilhados em um prato claro."
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
              preload
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm">
              Imagem de demonstração
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
