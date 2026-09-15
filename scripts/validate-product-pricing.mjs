import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
  const {
    addOrIncrementCartItem,
    createCartItem,
    getCartItemVariantLabel,
  } = await vite.ssrLoadModule("/src/utils/cart-item.ts");
  const { getProductPricePresentation } = await vite.ssrLoadModule(
    "/src/utils/product-price.ts",
  );
  const { getCircularImageIndex, getSwipeDirection } =
    await vite.ssrLoadModule("/src/utils/product-image-carousel.ts");

  const getProduct = (id) => {
    const product = products.find((candidate) => candidate.id === id);

    assert.ok(product, `Produto não encontrado: ${id}`);
    return product;
  };

  assert.equal(products.length, 10);
  assert.equal(
    products.some((product) =>
      product.description.toLowerCase().includes("lorem ipsum"),
    ),
    false,
  );

  const expectedProductImages = new Map([
    ["brownie-tradicional", ["/images/products/brownie-t.webp"]],
    ["brownie-nutella", ["/images/products/brownie-nutella.webp"]],
    ["brownie-amendoim", ["/images/products/brownie-amendoim.webp"]],
    [
      "brownie-chocolate-50",
      [
        "/images/products/brownie-chocolate-1.webp",
        "/images/products/brownie-chocolate-2.webp",
      ],
    ],
    ["brownie-de-pote", ["/images/products/brownie-pote.webp"]],
    [
      "bolo-de-brownie",
      [
        "/images/products/bolo-brownie-1.webp",
        "/images/products/bolo-brownie-2.webp",
        "/images/products/bolo-brownie-3.webp",
      ],
    ],
    ["bombom-de-morango", ["/images/products/bombom-morango.webp"]],
    ["brownie-bits", ["/images/products/brownie-bits.webp"]],
    [
      "bombom-de-brownie",
      [
        "/images/products/bombom-brownie-1.webp",
        "/images/products/bombom-brownie-2.webp",
      ],
    ],
    ["rocambole-de-brownie", ["/images/products/rocambole-brownie.webp"]],
  ]);

  for (const product of products) {
    assert.equal("image" in product, false);
    assert.deepEqual(product.images, expectedProductImages.get(product.id));
    assert.ok(product.images.length > 0);

    for (const image of product.images) {
      assert.match(image, /^\/images\/products\/[a-z0-9-]+\.webp$/);
      const absoluteImagePath = path.join(
        projectRoot,
        "public",
        image.replace(/^\//, ""),
      );

      assert.equal(existsSync(absoluteImagePath), true, image);
      const imageContents = readFileSync(absoluteImagePath);
      assert.equal(imageContents.toString("ascii", 0, 4), "RIFF", image);
      assert.equal(imageContents.toString("ascii", 8, 12), "WEBP", image);
    }
  }

  assert.equal(getProduct("brownie-tradicional").images.length, 1);
  assert.equal(getProduct("bolo-de-brownie").images.length, 3);
  assert.equal(getCircularImageIndex(0, -1, 3), 2);
  assert.equal(getCircularImageIndex(2, 1, 3), 0);
  assert.equal(getCircularImageIndex(1, 1, 3), 2);
  assert.equal(getSwipeDirection(-64, 8), "next");
  assert.equal(getSwipeDirection(64, 8), "previous");
  assert.equal(getSwipeDirection(40, 2), null);
  assert.equal(getSwipeDirection(64, 80), null);

  const fixedPriceExpectations = [
    ["brownie-tradicional", "Brownie tradicional", 600],
    ["brownie-nutella", "Brownie com Nutella", 800],
    ["brownie-amendoim", "Brownie com amendoim", 800],
    [
      "brownie-chocolate-50",
      "Brownie com casquinha de chocolate 50%",
      800,
    ],
    ["bombom-de-morango", "Bombom de morango", 1000],
    ["brownie-bits", "Brownie bits 100g", 1800],
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
  assert.equal(potBrownie.priceType, "by-size-and-flavor");
  assert.deepEqual(getProductPricePresentation(potBrownie), {
    kind: "starting-at",
    priceInCents: 1700,
  });
  assert.deepEqual(
    potBrownie.sizes.map(({ value, label }) => ({ value, label })),
    [
      { value: "300g", label: "300 g" },
      { value: "800g", label: "800 g" },
    ],
  );
  assert.equal(
    potBrownie.sizes.every(({ isApproximate }) => isApproximate),
    true,
  );
  assert.deepEqual(
    potBrownie.flavors.map(({ name }) => name),
    [
      "Ninho com Nutella",
      "Brigadeiro",
      "Brigadeiro branco",
      "Ninho",
      "Bem casado",
    ],
  );
  assert.equal(createCartItem(potBrownie), null);
  assert.equal(
    createCartItem(potBrownie, { flavor: "Brigadeiro" }),
    null,
  );
  assert.equal(createCartItem(potBrownie, { size: "300g" }), null);
  assert.equal(
    createCartItem(potBrownie, {
      flavor: "Brigadeiro",
      size: "tamanho-inexistente",
    }),
    null,
  );
  assert.equal(
    createCartItem(potBrownie, {
      flavor: "Sabor inexistente",
      size: "300g",
    }),
    null,
  );
  assert.equal(
    createCartItem(potBrownie, {
      flavor: "Prestígio",
      size: "300g",
    }),
    null,
  );

  const expectedPotPrices300g = new Map([
    ["Ninho com Nutella", 1800],
    ["Brigadeiro", 1700],
    ["Brigadeiro branco", 1700],
    ["Ninho", 1700],
    ["Bem casado", 1700],
  ]);
  const expectedPotPrices800g = new Map([
    ["Ninho com Nutella", 7000],
    ["Brigadeiro", 6000],
    ["Brigadeiro branco", 6000],
    ["Ninho", 6000],
    ["Bem casado", 6000],
  ]);
  const potItems300g = potBrownie.flavors.map(({ name }) => {
    const item = createCartItem(potBrownie, {
      flavor: name,
      size: "300g",
    });

    assert.ok(item);
    assert.equal(item.flavor, name);
    assert.equal(item.size.value, "300g");
    assert.equal(item.size.label, "300 g");
    assert.equal(item.size.isApproximate, true);
    assert.equal(item.unitPriceInCents, expectedPotPrices300g.get(name));
    return item;
  });
  const potItems800g = potBrownie.flavors.map(({ name }) => {
    const item = createCartItem(potBrownie, {
      flavor: name,
      size: "800g",
    });

    assert.ok(item);
    assert.equal(item.flavor, name);
    assert.equal(item.size.value, "800g");
    assert.equal(item.size.label, "800 g");
    assert.equal(item.size.isApproximate, true);
    assert.equal(item.unitPriceInCents, expectedPotPrices800g.get(name));
    return item;
  });

  const brigadeiro = potItems300g[1];
  const ninhoWithNutella = potItems300g[0];
  assert.equal(getCartItemVariantLabel(potItems800g[3]), "Ninho • ± 800 g");
  assert.notEqual(brigadeiro.id, ninhoWithNutella.id);
  assert.notEqual(potItems300g[3].id, potItems800g[3].id);

  const repeatedPotCombination = addOrIncrementCartItem(
    addOrIncrementCartItem([], potItems800g[3]),
    createCartItem(potBrownie, { flavor: "Ninho", size: "800g" }),
  );
  assert.equal(repeatedPotCombination.length, 1);
  assert.equal(repeatedPotCombination[0].quantity, 2);

  const differentPotCombinations = addOrIncrementCartItem(
    addOrIncrementCartItem([], potItems300g[3]),
    potItems800g[3],
  );
  assert.equal(differentPotCombinations.length, 2);

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
    kind: "starting-at",
    priceInCents: 10000,
  });
  assert.equal(createCartItem(brownieCake), null);
  assert.equal(
    createCartItem(brownieCake, { flavor: "Brigadeiro" }),
    null,
  );
  assert.equal(createCartItem(brownieCake, { size: "1kg" }), null);

  const cakeBrigadeiro1kg = createCartItem(brownieCake, {
    flavor: "Brigadeiro",
    size: "1kg",
  });
  const cakeBrigadeiro2kg = createCartItem(brownieCake, {
    flavor: "Brigadeiro",
    size: "2kg",
  });
  const cakeNinhoNutella1kg = createCartItem(brownieCake, {
    flavor: "Ninho com Nutella",
    size: "1kg",
  });
  const cakeNinhoNutella2kg = createCartItem(brownieCake, {
    flavor: "Ninho com Nutella",
    size: "2kg",
  });
  const cakeNinhoNutella3kg = createCartItem(brownieCake, {
    flavor: "Ninho com Nutella",
    size: "3kg",
  });

  assert.ok(cakeBrigadeiro1kg);
  assert.ok(cakeBrigadeiro2kg);
  assert.ok(cakeNinhoNutella1kg);
  assert.ok(cakeNinhoNutella2kg);
  assert.ok(cakeNinhoNutella3kg);
  assert.equal(cakeBrigadeiro1kg.unitPriceInCents, 10000);
  assert.equal(cakeBrigadeiro2kg.unitPriceInCents, 15000);
  assert.equal(cakeNinhoNutella1kg.unitPriceInCents, 11000);
  assert.equal(cakeNinhoNutella2kg.unitPriceInCents, 16000);
  assert.equal(cakeNinhoNutella3kg.unitPriceInCents, 21000);
  assert.equal(
    createCartItem(brownieCake, {
      flavor: "Prestígio",
      size: "1kg",
    }),
    null,
  );
  assert.equal(
    getCartItemVariantLabel(cakeBrigadeiro2kg),
    "Brigadeiro • 2 kg",
  );
  assert.notEqual(cakeBrigadeiro1kg.id, cakeBrigadeiro2kg.id);

  const cakeCart = addOrIncrementCartItem(
    addOrIncrementCartItem([], cakeBrigadeiro1kg),
    createCartItem(brownieCake, {
      flavor: "Brigadeiro",
      size: "1kg",
    }),
  );
  assert.equal(cakeCart.length, 1);
  assert.equal(cakeCart[0].quantity, 2);

  const brownieRoll = getProduct("rocambole-de-brownie");
  assert.equal(brownieRoll.name, "Rocambole de brownie");
  assert.deepEqual(getProductPricePresentation(brownieRoll), {
    kind: "starting-at",
    priceInCents: 9000,
  });
  assert.deepEqual(
    brownieRoll.flavors.map(({ name }) => name),
    [
      "Ninho com Nutella",
      "Brigadeiro",
      "Brigadeiro branco",
      "Ninho",
      "Bem casado",
      "Prestígio",
    ],
  );
  assert.equal(createCartItem(brownieRoll), null);

  const rollBrigadeiro = createCartItem(brownieRoll, {
    flavor: "Brigadeiro",
  });
  const rollNinhoNutella = createCartItem(brownieRoll, {
    flavor: "Ninho com Nutella",
  });
  const rollPrestigio = createCartItem(brownieRoll, {
    flavor: "Prestígio",
  });

  assert.ok(rollBrigadeiro);
  assert.ok(rollNinhoNutella);
  assert.ok(rollPrestigio);
  assert.equal(rollBrigadeiro.unitPriceInCents, 9000);
  assert.equal(rollPrestigio.unitPriceInCents, 9000);
  assert.equal(rollNinhoNutella.unitPriceInCents, 10000);
  assert.notEqual(rollBrigadeiro.id, rollNinhoNutella.id);
  assert.equal(
    createCartItem(brownieRoll, { flavor: "Sabor inexistente" }),
    null,
  );

  const rollCart = addOrIncrementCartItem(
    addOrIncrementCartItem([], rollBrigadeiro),
    createCartItem(brownieRoll, { flavor: "Brigadeiro" }),
  );
  assert.equal(rollCart.length, 1);
  assert.equal(rollCart[0].quantity, 2);

  const filledBrownieBonbon = getProduct("bombom-de-brownie");
  assert.deepEqual(
    filledBrownieBonbon.flavors.map(({ name }) => name),
    brownieRoll.flavors.map(({ name }) => name),
  );
  assert.equal(createCartItem(filledBrownieBonbon), null);

  const bonbonBrigadeiro = createCartItem(filledBrownieBonbon, {
    flavor: "Brigadeiro",
  });
  const bonbonNinhoNutella = createCartItem(filledBrownieBonbon, {
    flavor: "Ninho com Nutella",
  });
  const bonbonPrestigio = createCartItem(filledBrownieBonbon, {
    flavor: "Prestígio",
  });

  assert.ok(bonbonBrigadeiro);
  assert.ok(bonbonNinhoNutella);
  assert.ok(bonbonPrestigio);
  assert.equal(bonbonBrigadeiro.unitPriceInCents, 12000);
  assert.equal(bonbonPrestigio.unitPriceInCents, 12000);
  assert.equal(bonbonNinhoNutella.unitPriceInCents, 13000);
  assert.notEqual(bonbonBrigadeiro.id, bonbonNinhoNutella.id);
  assert.equal(
    createCartItem(filledBrownieBonbon, { flavor: "Sabor inexistente" }),
    null,
  );

  const bonbonCart = addOrIncrementCartItem(
    addOrIncrementCartItem([], bonbonBrigadeiro),
    createCartItem(filledBrownieBonbon, { flavor: "Brigadeiro" }),
  );
  assert.equal(bonbonCart.length, 1);
  assert.equal(bonbonCart[0].quantity, 2);

  assert.equal(
    products.some(({ id }) => id === "super-brownie-de-pote"),
    false,
  );

  const checkoutItems = [
    cakeBrigadeiro1kg,
    { ...cakeBrigadeiro2kg, quantity: 2 },
    cakeNinhoNutella3kg,
    { ...rollBrigadeiro, quantity: 2 },
    rollNinhoNutella,
  ];
  const checkoutTotalInCents = checkoutItems.reduce(
    (total, item) => total + item.unitPriceInCents * item.quantity,
    0,
  );
  assert.equal(checkoutTotalInCents, 89000);

  assert.equal(
    products.some((product) => product.priceType === "consult"),
    false,
  );

  assert.equal(brigadeiro.unitPriceInCents, 1700);

  console.log(
    "Validação de preços concluída: fixo, por sabor, por tamanho, variantes e totais.",
  );
} finally {
  await vite.close();
}
