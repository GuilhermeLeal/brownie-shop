import Image from "next/image";

import { products } from "@/data/products";

const bestSellerIds = [
  "brownie-tradicional",
  "brownie-de-pote",
  "rocambole-de-brownie",
] as const;

const bestSellers = bestSellerIds.map((productId) => {
  const product = products.find(({ id }) => id === productId);
  const image = product?.images[0];

  if (!product || !image) {
    throw new Error(`Produto mais vendido não encontrado: ${productId}`);
  }

  return { product, image };
});

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
            Três escolhas queridas para deixar qualquer momento mais gostoso.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {bestSellers.map(({ product, image }) => (
            <article key={product.id}>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-primary/20">
                <Image
                  src={image}
                  alt={`Foto de ${product.name}`}
                  fill
                  sizes="(min-width: 1200px) 360px, (min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </figure>

              <div className="mt-5">
                <h3 className="font-heading text-2xl font-bold leading-tight">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-chocolate/65">
                  {product.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
