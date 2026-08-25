import type { Product } from "@/types/product";

const TEMPORARY_DESCRIPTION =
  "Descrição provisória: lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const TEMPORARY_PRICE = "R$ 00,00";

const POT_AND_CAKE_FLAVORS = [
  "Ninho com Nutella",
  "Brigadeiro",
  "Brigadeiro branco",
  "Ninho",
  "Bem casado",
] as const;

// Dados e imagens temporários: substituir pelas informações e fotografias reais.
export const products = [
  {
    id: "brownie-tradicional",
    name: "Brownie tradicional",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-01.png",
  },
  {
    id: "brownie-nutella",
    name: "Brownie de Nutella",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-02.png",
  },
  {
    id: "brownie-amendoim",
    name: "Brownie de amendoim",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-03.png",
  },
  {
    id: "brownie-chocolate-50",
    name: "Brownie com chocolate 50%",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-hero-brownies.png",
  },
  {
    id: "brownie-de-pote",
    name: "Brownie de pote",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-01.png",
    flavors: POT_AND_CAKE_FLAVORS,
  },
  {
    id: "bolo-de-brownie",
    name: "Bolo de brownie",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-02.png",
    flavors: POT_AND_CAKE_FLAVORS,
  },
  {
    id: "bombom-de-morango",
    name: "Bombom de morango",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-03.png",
  },
  {
    id: "brownie-bits",
    name: "Brownie bits",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-hero-brownies.png",
  },
  {
    id: "bombom-de-brownie",
    name: "Bombom de brownie",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-01.png",
  },
  {
    id: "super-brownie-de-pote",
    name: "Super brownie de pote",
    description: TEMPORARY_DESCRIPTION,
    price: TEMPORARY_PRICE,
    image: "/images/demo/demo-bestseller-02.png",
  },
] satisfies readonly Product[];
