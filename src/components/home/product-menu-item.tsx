import Image from "next/image";

import type { Product } from "@/types/product";

type ProductMenuItemProps = {
  product: Product;
  index: number;
};

export function ProductMenuItem({ product, index }: ProductMenuItemProps) {
  const imageOnRight = index % 2 !== 0;
  const itemNumber = String(index + 1).padStart(2, "0");
  const blockColor = index % 2 === 0 ? "bg-secondary/40" : "bg-primary/40";
  const desktopColumns = imageOnRight
    ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
    : "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]";

  return (
    <article
      className={`grid items-center gap-6 rounded-[2.25rem] p-5 sm:gap-8 sm:rounded-[3rem] sm:p-8 md:gap-10 md:p-10 lg:gap-14 lg:p-12 ${blockColor} ${desktopColumns}`}
    >
      <figure
        className={`relative aspect-[8/5] overflow-hidden rounded-[1.5rem] bg-white/30 sm:rounded-[2rem] md:aspect-[4/3] ${
          imageOnRight ? "md:order-2" : "md:order-1"
        }`}
      >
        <Image
          src={product.image}
          alt={`Imagem temporária de demonstração para ${product.name}.`}
          fill
          sizes="(min-width: 1200px) 430px, (min-width: 768px) 38vw, 100vw"
          className="object-cover"
        />
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm sm:bottom-4 sm:left-4">
          Imagem temporária
        </figcaption>
      </figure>

      <div
        className={`max-w-lg ${
          imageOnRight ? "md:order-1 md:justify-self-end" : "md:order-2"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-chocolate/55">
          Item {itemNumber}
        </p>
        <h3 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {product.name}
        </h3>
        <p className="mt-4 text-pretty leading-7 text-chocolate/70">
          {product.description}
        </p>
        <p className="mt-5 text-lg font-bold">{product.price}</p>

        {product.flavors && (
          <div className="mt-7 border-l-4 border-chocolate/20 pl-4">
            <p className="text-sm font-bold">Sabores</p>
            <ul
              className="mt-3 flex flex-wrap gap-2"
              aria-label={`Sabores de ${product.name}`}
            >
              {product.flavors.map((flavor) => (
                <li
                  key={flavor}
                  className="rounded-full bg-white/60 px-3 py-2 text-sm text-chocolate/75"
                >
                  {flavor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
