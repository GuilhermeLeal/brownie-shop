import Image from "next/image";

// Conteúdo e imagens temporários: substituir pelos produtos reais quando definidos.
const demoItems = [
  {
    name: "Item demonstrativo 01",
    description: "Nome e descrição provisórios para validar a composição do card.",
    price: "R$ 00,00",
    image: "/images/demo/demo-bestseller-01.png",
    alt: "Imagem temporária de um brownie sobre papel claro e fundo rosa.",
  },
  {
    name: "Item demonstrativo 02",
    description: "Nome e descrição provisórios para validar a composição do card.",
    price: "R$ 00,00",
    image: "/images/demo/demo-bestseller-02.png",
    alt: "Imagem temporária de um brownie sobre um prato azul claro.",
  },
  {
    name: "Item demonstrativo 03",
    description: "Nome e descrição provisórios para validar a composição do card.",
    price: "R$ 00,00",
    image: "/images/demo/demo-bestseller-03.png",
    alt: "Imagem temporária de três brownies vistos de cima.",
  },
];

export function BestSellers() {
  return (
    <section
      id="mais-vendidos"
      className="bg-white py-20 sm:py-24 lg:py-28"
      aria-labelledby="best-sellers-title"
    >
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-chocolate/60">
            Favoritos da casa
          </p>
          <h2
            id="best-sellers-title"
            className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Mais vendidos
          </h2>
          <p className="mt-4 text-pretty leading-7 text-chocolate/70">
            Espaço de demonstração para os doces que futuramente serão os mais
            procurados da marca.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {demoItems.map((item) => (
            <article key={item.name}>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-primary/20">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1200px) 360px, (min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
                <figcaption className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm">
                  Conteúdo demonstrativo
                </figcaption>
              </figure>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-2xl font-bold leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-chocolate/65">
                    {item.description}
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-background px-3 py-2 text-sm font-bold">
                  {item.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
