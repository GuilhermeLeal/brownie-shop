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
  const { createOrder } = await vite.ssrLoadModule(
    "/src/server/orders/create-order.ts",
  );
  const { OrderValidationError, validateCreateOrderPayload } =
    await vite.ssrLoadModule("/src/server/orders/validate-order.ts");
  const { getDateInputValueInTimeZone, getMinimumOrderDate } =
    await vite.ssrLoadModule("/src/utils/date.ts");
  const { validateOrderDetails } = await vite.ssrLoadModule(
    "/src/utils/validate-order-details.ts",
  );
  const today = "2026-09-02";
  const tomorrow = "2026-09-03";
  const minimumOrderDate = "2026-09-04";
  const basePayload = {
    customerName: "Cliente de Teste",
    customerPhone: "(11) 99999-9999",
    requestedDate: minimumOrderDate,
    fulfillmentType: "pickup",
    notes: "Teste automatizado",
  };
  const validate = (overrides = {}) =>
    validateCreateOrderPayload(
      {
        ...basePayload,
        items: [{ productId: "brownie-tradicional", quantity: 1 }],
        ...overrides,
      },
      today,
    );
  const expectInvalid = (overrides) => {
    assert.throws(() => validate(overrides), OrderValidationError);
  };

  const tamperedCommonProduct = validate({
    productsTotalCents: 1,
    status: "confirmed",
    items: [
      {
        productId: "brownie-tradicional",
        productName: "Produto adulterado",
        unitPriceInCents: 1,
        quantity: 2,
      },
    ],
  });
  assert.equal(tamperedCommonProduct.productsTotalCents, 1200);
  assert.equal(tamperedCommonProduct.items[0].productName, "Brownie tradicional");
  assert.equal(tamperedCommonProduct.items[0].unitPriceInCents, 600);
  assert.equal(tamperedCommonProduct.items[0].flavor, null);
  assert.equal(tamperedCommonProduct.items[0].size, null);

  const potBrownie = validate({
    items: [
      {
        productId: "brownie-de-pote",
        flavor: "Brigadeiro",
        size: "300g",
        quantity: 1,
      },
    ],
  });
  assert.equal(potBrownie.productsTotalCents, 1700);
  assert.equal(potBrownie.items[0].flavor, "Brigadeiro");
  assert.equal(potBrownie.items[0].size, "300 g");

  const potFlavorPrices300g = new Map([
    ["Ninho com Nutella", 1800],
    ["Brigadeiro", 1700],
    ["Brigadeiro branco", 1700],
    ["Ninho", 1700],
    ["Bem casado", 1700],
  ]);
  const validatedPotOrders300g = [...potFlavorPrices300g].map(
    ([flavor, expectedPrice]) => {
      const order = validate({
        productsTotalCents: 1,
        items: [
          {
            productId: "brownie-de-pote",
            flavor,
            size: "300g",
            unitPriceInCents: 1,
            quantity: 1,
          },
        ],
      });

      assert.equal(order.productsTotalCents, expectedPrice);
      assert.equal(order.items[0].flavor, flavor);
      assert.equal(order.items[0].size, "300 g");
      assert.equal(order.items[0].unitPriceInCents, expectedPrice);
      return order;
    },
  );
  const validatedPotOrders800g = [...potFlavorPrices300g.keys()].map(
    (flavor) => {
      const order = validate({
        productsTotalCents: 1,
        items: [
          {
            productId: "brownie-de-pote",
            flavor,
            size: "800g",
            unitPriceInCents: 1,
            quantity: 1,
          },
        ],
      });

      assert.equal(order.productsTotalCents, 6000);
      assert.equal(order.items[0].flavor, flavor);
      assert.equal(order.items[0].size, "800 g");
      assert.equal(order.items[0].unitPriceInCents, 6000);
      return order;
    },
  );
  assert.equal(validatedPotOrders300g.length, 5);
  assert.equal(validatedPotOrders800g.length, 5);

  const combinedPotOrder = validate({
    items: [
      {
        productId: "brownie-de-pote",
        flavor: "Ninho",
        size: "800g",
        quantity: 1,
      },
      {
        productId: "brownie-de-pote",
        flavor: "Ninho",
        size: "800g",
        quantity: 2,
      },
      {
        productId: "brownie-de-pote",
        flavor: "Ninho",
        size: "300g",
        quantity: 1,
      },
    ],
  });
  assert.equal(combinedPotOrder.items.length, 2);
  assert.equal(combinedPotOrder.items[0].quantity, 3);
  assert.equal(combinedPotOrder.items[1].quantity, 1);
  assert.equal(combinedPotOrder.productsTotalCents, 19700);

  const brownieCake = validate({
    items: [
      {
        productId: "bolo-de-brownie",
        flavor: "Ninho com Nutella",
        size: "3kg",
        quantity: 1,
      },
    ],
  });
  assert.equal(brownieCake.productsTotalCents, 20000);
  assert.equal(brownieCake.items[0].flavor, "Ninho com Nutella");
  assert.equal(brownieCake.items[0].size, "3 kg");

  const filledBrownieBonbon = validate({
    productsTotalCents: 1,
    items: [
      {
        productId: "bombom-de-brownie",
        flavor: "Brigadeiro",
        unitPriceInCents: 1,
        quantity: 1,
      },
    ],
  });
  assert.equal(filledBrownieBonbon.productsTotalCents, 12000);
  assert.equal(filledBrownieBonbon.items[0].flavor, "Brigadeiro");
  assert.equal(filledBrownieBonbon.items[0].unitPriceInCents, 12000);

  const filledBrownieBonbonNinhoNutella = validate({
    items: [
      {
        productId: "bombom-de-brownie",
        flavor: "Ninho com Nutella",
        quantity: 1,
      },
    ],
  });
  assert.equal(filledBrownieBonbonNinhoNutella.productsTotalCents, 12000);

  const preparedStatements = [];
  const fakeDatabase = {
    prepare(sql) {
      const statement = {
        sql,
        values: [],
        bind(...values) {
          this.values = values;
          return this;
        },
      };

      preparedStatements.push(statement);
      return statement;
    },
    async batch() {
      return [
        { meta: { last_row_id: 321 } },
        { meta: { changes: 1 } },
      ];
    },
  };
  const persistedPotOrder = await createOrder(
    fakeDatabase,
    validatedPotOrders800g[0],
  );
  assert.equal(persistedPotOrder.orderId, 321);
  assert.match(preparedStatements[1].sql, /INSERT INTO order_items/);
  assert.deepEqual(preparedStatements[1].values, [
    "brownie-de-pote",
    "Brownie de pote",
    "Ninho com Nutella",
    "800 g",
    1,
    6000,
  ]);

  const multipleProducts = validate({
    items: [
      { productId: "brownie-tradicional", quantity: 1 },
      {
        productId: "brownie-de-pote",
        flavor: "Ninho com Nutella",
        size: "300g",
        quantity: 1,
      },
      {
        productId: "bolo-de-brownie",
        flavor: "Brigadeiro",
        size: "2kg",
        quantity: 1,
      },
      {
        productId: "rocambole-de-brownie",
        flavor: "Ninho",
        quantity: 1,
      },
    ],
  });
  assert.equal(multipleProducts.productsTotalCents, 26400);

  const delivery = validate({ fulfillmentType: "delivery" });
  assert.equal(delivery.fulfillmentType, "delivery");
  assert.equal(delivery.productsTotalCents, 600);
  assert.equal("deliveryAddress" in delivery, false);

  const deliveryWithLegacyAddress = validate({
    fulfillmentType: "delivery",
    deliveryAddress: "Campo antigo deve ser ignorado",
  });
  assert.equal(deliveryWithLegacyAddress.fulfillmentType, "delivery");
  assert.equal("deliveryAddress" in deliveryWithLegacyAddress, false);

  const pickup = validate({ fulfillmentType: "pickup" });
  assert.equal(pickup.fulfillmentType, "pickup");
  assert.equal("deliveryAddress" in pickup, false);

  assert.equal(getMinimumOrderDate(today), minimumOrderDate);
  assert.equal(getMinimumOrderDate("2026-12-31"), "2027-01-02");
  assert.equal(
    getDateInputValueInTimeZone(
      "America/Sao_Paulo",
      new Date("2026-09-03T01:30:00.000Z"),
    ),
    today,
  );
  assert.equal(validate().requestedDate, minimumOrderDate);
  assert.equal(
    validate({ requestedDate: "2026-09-06" }).requestedDate,
    "2026-09-06",
  );
  assert.equal(new Date("2026-09-06T12:00:00.000Z").getUTCDay(), 0);

  const frontendDetails = {
    name: "Cliente de Teste",
    phone: "11999999999",
    desiredDate: minimumOrderDate,
    fulfillmentMethod: "delivery",
    notes: "",
  };
  assert.deepEqual(
    validateOrderDetails(frontendDetails, minimumOrderDate),
    {},
  );
  assert.equal(
    validateOrderDetails(
      { ...frontendDetails, desiredDate: today },
      minimumOrderDate,
    ).desiredDate,
    "Escolha uma data com pelo menos 2 dias de antecedência.",
  );

  expectInvalid({ requestedDate: today });
  expectInvalid({ requestedDate: tomorrow });
  expectInvalid({ requestedDate: "2026-09-01" });
  expectInvalid({ fulfillmentType: "invalid" });
  expectInvalid({ customerName: "   " });
  expectInvalid({ customerPhone: "123" });
  expectInvalid({ items: [] });
  expectInvalid({ items: [{ productId: "produto-inexistente", quantity: 1 }] });
  expectInvalid({
    items: [{ productId: "brownie-de-pote", quantity: 1 }],
  });
  expectInvalid({
    items: [
      {
        productId: "brownie-de-pote",
        flavor: "Brigadeiro",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [
      {
        productId: "brownie-de-pote",
        size: "300g",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [
      {
        productId: "brownie-de-pote",
        flavor: "Sabor inexistente",
        size: "300g",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [
      {
        productId: "brownie-de-pote",
        flavor: "Brigadeiro",
        size: "tamanho-inexistente",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [{ productId: "super-brownie-de-pote", quantity: 1 }],
  });
  expectInvalid({
    items: [{ productId: "bombom-de-brownie", quantity: 1 }],
  });
  expectInvalid({
    items: [
      {
        productId: "bombom-de-brownie",
        flavor: "Sabor inexistente",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [
      {
        productId: "bolo-de-brownie",
        flavor: "Brigadeiro",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [
      {
        productId: "bolo-de-brownie",
        flavor: "Brigadeiro",
        size: "4kg",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [
      {
        productId: "brownie-tradicional",
        flavor: "Brigadeiro",
        quantity: 1,
      },
    ],
  });
  expectInvalid({
    items: [{ productId: "brownie-tradicional", quantity: 0 }],
  });
  expectInvalid({
    items: [{ productId: "brownie-tradicional", quantity: 100 }],
  });
  expectInvalid({ notes: "x".repeat(501) });

  console.log(
    "Validação de pedidos concluída: antecedência, recebimento, variantes, limites e reprecificação server-side.",
  );
} finally {
  await vite.close();
}
