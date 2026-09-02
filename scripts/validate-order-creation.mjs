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
  const { OrderValidationError, validateCreateOrderPayload } =
    await vite.ssrLoadModule("/src/server/orders/validate-order.ts");
  const today = "2026-09-02";
  const basePayload = {
    customerName: "Cliente de Teste",
    customerPhone: "(11) 99999-9999",
    requestedDate: today,
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
        quantity: 1,
      },
    ],
  });
  assert.equal(potBrownie.productsTotalCents, 1700);
  assert.equal(potBrownie.items[0].flavor, "Brigadeiro");
  assert.equal(potBrownie.items[0].size, null);

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

  const multipleProducts = validate({
    items: [
      { productId: "brownie-tradicional", quantity: 1 },
      {
        productId: "brownie-de-pote",
        flavor: "Ninho com Nutella",
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

  const delivery = validate({
    fulfillmentType: "delivery",
    deliveryAddress: "Rua de Teste, 123",
  });
  assert.equal(delivery.deliveryAddress, "Rua de Teste, 123");

  const pickup = validate({
    fulfillmentType: "pickup",
    deliveryAddress: "Este endereço deve ser ignorado",
  });
  assert.equal(pickup.deliveryAddress, null);

  assert.equal(validate().requestedDate, today);
  assert.equal(
    validate({ requestedDate: "2026-09-06" }).requestedDate,
    "2026-09-06",
  );

  expectInvalid({ requestedDate: "2026-09-01" });
  expectInvalid({ fulfillmentType: "delivery", deliveryAddress: "" });
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
    "Validação de pedidos concluída: dados, datas, variantes, limites e reprecificação server-side.",
  );
} finally {
  await vite.close();
}
