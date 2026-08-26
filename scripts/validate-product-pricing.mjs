import assert from "node:assert/strict";
import path from "node:path";

import { createServer } from "vite";

const projectRoot = process.cwd();
const vite = await createServer({
  appType: "custom",
  configFile: false,
  logLevel: "silent",
  resolve: {
    alias: {
      "@": path.join(projectRoot, "src"),
    },
  },
  server: {
    middlewareMode: true,
  },
});

try {
  const { products } = await vite.ssrLoadModule("/src/data/products.ts");
  const { createCartItem } = await vite.ssrLoadModule(
    "/src/utils/cart-item.ts",
  );
  const { getProductPricePresentation } = await vite.ssrLoadModule(
    "/src/utils/product-price.ts",
  );

  const getProduct = (id) => {
    const product = products.find((candidate) => candidate.id === id);

    assert.ok(product, `Produto não encontrado: ${id}`);
    return product;
  };

  assert.equal(products.length, 10);

  const fixedPriceExpectations = [
    ["brownie-tradicional", "Brownie tradicional", 600],
    ["brownie-nutella", "Brownie com Nutella", 800],
    ["brownie-amendoim", "Brownie com amendoim", 800],
    [
      "brownie-chocolate-50",
      "Brownie com casquinha de chocolate 50%",
      800,
    ],
    ["bombom-de-morango", "Bombom de morango", 1200],
    ["brownie-bits", "Brownie bits 100g", 1800],
    [
      "bombom-de-brownie",
      "Bombom de brownie com recheio",
      12000,
    ],
    ["super-brownie-de-pote", "Super brownie de pote", 6000],
  ];

  for (const [id, expectedName, expectedPrice] of fixedPriceExpectations) {
    const item = createCartItem(getProduct(id));

    assert.ok(item);
    assert.equal(item.name, expectedName);
    assert.equal(item.unitPriceInCents, expectedPrice);
  }

  const traditional = createCartItem(getProduct("brownie-tradicional"));
  assert.ok(traditional);
  assert.equal(traditional.unitPriceInCents, 600);

  const potBrownie = getProduct("brownie-de-pote");
  const brigadeiro = createCartItem(potBrownie, "Brigadeiro");
  const ninhoWithNutella = createCartItem(
    potBrownie,
    "Ninho com Nutella",
  );

  assert.ok(brigadeiro);
  assert.ok(ninhoWithNutella);
  assert.equal(brigadeiro.unitPriceInCents, 1700);
  assert.equal(ninhoWithNutella.unitPriceInCents, 1800);
  assert.notEqual(brigadeiro.id, ninhoWithNutella.id);

  const simulatedCart = [
    { ...traditional, quantity: 2 },
    brigadeiro,
    ninhoWithNutella,
  ];
  const totalInCents = simulatedCart.reduce(
    (total, item) => total + item.unitPriceInCents * item.quantity,
    0,
  );
  assert.equal(totalInCents, 4700);

  const brownieCake = getProduct("bolo-de-brownie");
  assert.deepEqual(getProductPricePresentation(brownieCake), {
    kind: "consult",
  });
  assert.equal(createCartItem(brownieCake), null);
  assert.equal(createCartItem(brownieCake, "Brigadeiro"), null);

  assert.equal(brigadeiro.unitPriceInCents, 1700);

  console.log(
    "Validação de preços concluída: fixo, por sabor, itens distintos, total e consulta.",
  );
} finally {
  await vite.close();
}
