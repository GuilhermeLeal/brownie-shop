import type { Product } from "@/types/product";

const TEMPORARY_DESCRIPTION =
  "Descrição provisória: lorem ipsum dolor sit amet, consectetur adipiscing elit.";

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

const BROWNIE_CAKE_FLAVORS = FLAVOR_NAMES.map((name) => ({ name }));

// Descrições e imagens ainda são temporárias; nomes e preços estão atualizados.
export const products = [
  {
    id: "brownie-tradicional",
    name: "Brownie tradicional",
    description: TEMPORARY_DESCRIPTION,
    priceType: "fixed",
    priceInCents: 600,
    image: "/images/demo/demo-bestseller-01.png",
  },
  {
    id: "brownie-nutella",
    name: "Brownie com Nutella",
    description: TEMPORARY_DESCRIPTION,
    priceType: "fixed",
    priceInCents: 800,
    image: "/images/demo/demo-bestseller-02.png",
  },
  {
    id: "brownie-amendoim",
    name: "Brownie com amendoim",
    description: TEMPORARY_DESCRIPTION,
    priceType: "fixed",
    priceInCents: 800,
    image: "/images/demo/demo-bestseller-03.png",
  },
  {
    id: "brownie-chocolate-50",
    name: "Brownie com casquinha de chocolate 50%",
    description: TEMPORARY_DESCRIPTION,
    priceType: "fixed",
    priceInCents: 800,
    image: "/images/demo/demo-hero-brownies.png",
  },
  {
    id: "brownie-de-pote",
    name: "Brownie de pote",
    description: TEMPORARY_DESCRIPTION,
    priceType: "by-flavor",
    image: "/images/demo/demo-bestseller-01.png",
    flavors: BROWNIE_POT_FLAVORS,
  },
  {
    id: "bolo-de-brownie",
    name: "Bolo de brownie",
    description: TEMPORARY_DESCRIPTION,
    priceType: "consult",
    image: "/images/demo/demo-bestseller-02.png",
    flavors: BROWNIE_CAKE_FLAVORS,
  },
  {
    id: "bombom-de-morango",
    name: "Bombom de morango",
    description: TEMPORARY_DESCRIPTION,
    priceType: "fixed",
    priceInCents: 1200,
    image: "/images/demo/demo-bestseller-03.png",
  },
  {
    id: "brownie-bits",
    name: "Brownie bits 100g",
    description: TEMPORARY_DESCRIPTION,
    priceType: "fixed",
    priceInCents: 1800,
    image: "/images/demo/demo-hero-brownies.png",
  },
  {
    id: "bombom-de-brownie",
    name: "Bombom de brownie com recheio",
    description:
      "Produto com aproximadamente 2 kg. Descrição completa em breve.",
    priceType: "fixed",
    priceInCents: 12000,
    image: "/images/demo/demo-bestseller-01.png",
  },
  {
    id: "super-brownie-de-pote",
    name: "Super brownie de pote",
    description: TEMPORARY_DESCRIPTION,
    priceType: "fixed",
    priceInCents: 6000,
    image: "/images/demo/demo-bestseller-02.png",
  },
] satisfies readonly Product[];
