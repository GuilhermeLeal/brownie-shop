import Image from "next/image";

// Imagem temporária: substituir pelo retrato real da dona da marca.
const ownerImage = "/images/demo/demo-owner.png";

export function AboutOwner() {
  return (
    <section
      id="sobre"
      className="site-container scroll-mt-6 pb-24 pt-6 sm:pb-28 lg:pb-32"
      aria-labelledby="about-owner-title"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <figure className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-primary/20 lg:max-w-lg">
          <Image
            src={ownerImage}
            alt="Imagem temporária de uma confeiteira em uma cozinha artesanal."
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm">
            Retrato de demonstração
          </figcaption>
        </figure>

        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-chocolate/60">
            Sobre a dona
          </p>
          <h2
            id="about-owner-title"
            className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Quem está por trás de cada doce
          </h2>
          <p className="mt-6 text-pretty text-base leading-8 text-chocolate/70 sm:text-lg">
            Texto provisório: aqui entra uma apresentação breve da pessoa
            responsável por cada receita. Este espaço contará, em poucas
            palavras, como o cuidado e a produção artesanal fazem parte da
            marca.
          </p>
        </div>
      </div>
    </section>
  );
}
