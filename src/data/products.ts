import type { Product } from "@/types/product";

const FLAVOR_NAMES = [
  "Ninho com Nutella",
  "Brigadeiro",
  "Brigadeiro branco",
  "Ninho",
  "Bem casado",
] as const;

const BRIGADEIRO_FLAVORS = FLAVOR_NAMES.map((name) => ({ name }));
const BRIGADEIRO_FLAVORS_WITH_PRESTIGIO = [
  ...BRIGADEIRO_FLAVORS,
  { name: "Prestígio" as const },
];

function createFlavorPrices<const FlavorName extends string>(
  flavors: readonly { name: FlavorName }[],
  defaultPriceInCents: number,
  overrides: Partial<Record<FlavorName, number>> = {},
) {
  return flavors.map(({ name }) => ({
    name,
    priceInCents: overrides[name] ?? defaultPriceInCents,
  }));
}

const BROWNIE_POT_SIZES = [
  {
    value: "300g",
    label: "300 g",
    isApproximate: true,
    flavorPrices: createFlavorPrices(BRIGADEIRO_FLAVORS, 1700, {
      "Ninho com Nutella": 1800,
    }),
  },
  {
    value: "800g",
    label: "800 g",
    isApproximate: true,
    flavorPrices: createFlavorPrices(BRIGADEIRO_FLAVORS, 6000, {
      "Ninho com Nutella": 7000,
    }),
  },
] as const;

const BROWNIE_CAKE_SIZES = [
  {
    value: "1kg",
    label: "1 kg",
    flavorPrices: createFlavorPrices(BRIGADEIRO_FLAVORS, 10000, {
      "Ninho com Nutella": 11000,
    }),
  },
  {
    value: "2kg",
    label: "2 kg",
    flavorPrices: createFlavorPrices(BRIGADEIRO_FLAVORS, 15000, {
      "Ninho com Nutella": 16000,
    }),
  },
  {
    value: "3kg",
    label: "3 kg",
    flavorPrices: createFlavorPrices(BRIGADEIRO_FLAVORS, 20000, {
      "Ninho com Nutella": 21000,
    }),
  },
] as const;

// Caminhos definitivos: substitua os arquivos em public/images/products pelas
// fotografias reais, mantendo estes nomes para não precisar alterar o código.
export const products = [
  {
    id: "brownie-tradicional",
    name: "Brownie tradicional",
    description:
      "Brownie com chocolate 50%, molhadinho por dentro e com casquinha crocante por fora.",
    priceType: "fixed",
    priceInCents: 600,
    images: ["/images/products/brownie-t.webp"],
  },
  {
    id: "brownie-nutella",
    name: "Brownie com Nutella",
    description:
      "Brownie com chocolate 50%, finalizado com uma camada generosa de Nutella.",
    priceType: "fixed",
    priceInCents: 800,
    images: ["/images/products/brownie-nutella.webp"],
  },
  {
    id: "brownie-amendoim",
    name: "Brownie com amendoim",
    description:
      "Brownie com chocolate 50% e pedaços de amendoim, trazendo crocância a cada mordida.",
    priceType: "fixed",
    priceInCents: 800,
    images: ["/images/products/brownie-amendoim.webp"],
  },
  {
    id: "brownie-chocolate-50",
    name: "Brownie com casquinha de chocolate 50%",
    description:
      "Brownie com chocolate 50%, finalizado com uma casquinha de chocolate 50%.",
    priceType: "fixed",
    priceInCents: 800,
    images: [
      "/images/products/brownie-chocolate-1.webp",
      "/images/products/brownie-chocolate-2.webp",
    ],
  },
  {
    id: "brownie-de-pote",
    name: "Brownie de pote",
    description:
      "Cubinhos de brownie com recheio de brigadeiro à sua escolha, disponíveis em dois tamanhos.",
    priceType: "by-size-and-flavor",
    images: ["/images/products/brownie-pote.webp"],
    flavors: BRIGADEIRO_FLAVORS,
    sizes: BROWNIE_POT_SIZES,
  },
  {
    id: "bolo-de-brownie",
    name: "Bolo de brownie",
    description:
      "Bolo feito com massa de brownie, recheado com brigadeiro à sua escolha e finalizado de forma artesanal. Disponível em diferentes tamanhos.",
    priceType: "by-size-and-flavor",
    images: [
      "/images/products/bolo-brownie-1.webp",
      "/images/products/bolo-brownie-2.webp",
      "/images/products/bolo-brownie-3.webp",
    ],
    flavors: BRIGADEIRO_FLAVORS,
    sizes: BROWNIE_CAKE_SIZES,
  },
  {
    id: "bombom-de-morango",
    name: "Bombom de morango",
    description:
      "Morango fresquinho coberto com brigadeiro branco e banhado em chocolate 50%.",
    priceType: "fixed",
    priceInCents: 1000,
    images: ["/images/products/bombom-morango.webp"],
  },
  {
    id: "brownie-bits",
    name: "Brownie bits 100g",
    description:
      "Mini brownies em cubos, banhados em chocolate 50%. ± 100 g.",
    priceType: "fixed",
    priceInCents: 1800,
    images: ["/images/products/brownie-bits.webp"],
  },
  {
    id: "bombom-de-brownie",
    name: "Bombom de brownie com recheio",
    description:
      "Casquinha de chocolate 50% recheada com cubos de brownie e brigadeiro à sua escolha. ± 1,5 kg.",
    priceType: "by-flavor",
    images: [
      "/images/products/bombom-brownie-1.webp",
      "/images/products/bombom-brownie-2.webp",
    ],
    flavors: createFlavorPrices(
      BRIGADEIRO_FLAVORS_WITH_PRESTIGIO,
      12000,
      { "Ninho com Nutella": 13000 },
    ),
  },
  {
    id: "rocambole-de-brownie",
    name: "Rocambole de brownie",
    description:
      "Massa de brownie enrolada com recheio de brigadeiro à sua escolha e banhada em chocolate 50%. ± 800 g.",
    priceType: "by-flavor",
    images: ["/images/products/rocambole-brownie.webp"],
    flavors: createFlavorPrices(BRIGADEIRO_FLAVORS_WITH_PRESTIGIO, 9000, {
      "Ninho com Nutella": 10000,
    }),
  },
] satisfies readonly Product[];
