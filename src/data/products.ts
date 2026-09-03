import type { Product } from "@/types/product";

const FLAVOR_NAMES = [
  "Ninho com Nutella",
  "Brigadeiro",
  "Brigadeiro branco",
  "Ninho",
  "Bem casado",
] as const;

const BROWNIE_POT_FLAVORS = [
  { name: "Ninho com Nutella", priceInCents: 1800 },
  { name: "Brigadeiro", priceInCents: 1700 },
  { name: "Brigadeiro branco", priceInCents: 1700 },
  { name: "Ninho", priceInCents: 1700 },
  { name: "Bem casado", priceInCents: 1700 },
] as const;

const BRIGADEIRO_FLAVORS = FLAVOR_NAMES.map((name) => ({ name }));

const BROWNIE_CAKE_SIZES = [
  { value: "1kg", label: "1 kg", priceInCents: 10000 },
  { value: "2kg", label: "2 kg", priceInCents: 15000 },
  { value: "3kg", label: "3 kg", priceInCents: 20000 },
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
    images: ["/images/products/brownie-chocolate-50.webp"],
  },
  {
    id: "brownie-de-pote",
    name: "Brownie de pote",
    description:
      "Cubinhos de brownie com recheio de brigadeiro à sua escolha. Aproximadamente 300 g.",
    priceType: "by-flavor",
    images: ["/images/products/brownie-pote.webp"],
    flavors: BROWNIE_POT_FLAVORS,
  },
  {
    id: "bolo-de-brownie",
    name: "Bolo de brownie",
    description:
      "Bolo feito com massa de brownie, recheado com brigadeiro à sua escolha e finalizado de forma artesanal. Disponível em diferentes tamanhos.",
    priceType: "by-size",
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
    priceInCents: 1200,
    images: ["/images/products/bombom-morango.webp"],
  },
  {
    id: "brownie-bits",
    name: "Brownie bits 100g",
    description:
      "Mini brownies em cubos, banhados em chocolate 50%. Aproximadamente 100 g.",
    priceType: "fixed",
    priceInCents: 1800,
    images: ["/images/products/brownie-bits.webp"],
  },
  {
    id: "bombom-de-brownie",
    name: "Bombom de brownie com recheio",
    description:
      "Casquinha de chocolate 50% recheada com cubos de brownie e brigadeiro à sua escolha. Aproximadamente 1,5 kg.",
    priceType: "fixed",
    priceInCents: 12000,
    images: ["/images/products/bombom-brownie.webp"],
    flavors: BRIGADEIRO_FLAVORS,
  },
  {
    id: "super-brownie-de-pote",
    name: "Super brownie de pote",
    description:
      "Cubinhos de brownie com uma porção ainda mais generosa de brigadeiro à sua escolha. Aproximadamente 800 g.",
    priceType: "fixed",
    priceInCents: 6000,
    images: ["/images/products/super-brownie-pote.webp"],
  },
  {
    id: "rocambole-de-brownie",
    name: "Rocambole de brownie",
    description:
      "Massa de brownie enrolada com recheio de brigadeiro à sua escolha e banhada em chocolate 50%. Aproximadamente 800 g.",
    priceType: "fixed",
    priceInCents: 9000,
    images: ["/images/products/rocambole-brownie.webp"],
    flavors: BRIGADEIRO_FLAVORS,
  },
] satisfies readonly Product[];
