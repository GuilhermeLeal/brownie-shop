import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  const { resetOrderFlow } = await vite.ssrLoadModule(
    "/src/utils/order-flow.ts",
  );
  const {
    buildWhatsAppOrderMessage,
    buildWhatsAppOrderUrl,
    WHATSAPP_PHONE_NUMBER,
  } = await vite.ssrLoadModule("/src/utils/whatsapp-order.ts");
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
  const potFlavorPrices800g = new Map([
    ["Ninho com Nutella", 7000],
    ["Brigadeiro", 6000],
    ["Brigadeiro branco", 6000],
    ["Ninho", 6000],
    ["Bem casado", 6000],
  ]);
  const validatedPotOrders800g = [...potFlavorPrices800g].map(
    ([flavor, expectedPrice]) => {
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

      assert.equal(order.productsTotalCents, expectedPrice);
      assert.equal(order.items[0].flavor, flavor);
      assert.equal(order.items[0].size, "800 g");
      assert.equal(order.items[0].unitPriceInCents, expectedPrice);
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
  assert.equal(brownieCake.productsTotalCents, 21000);
  assert.equal(brownieCake.items[0].flavor, "Ninho com Nutella");
  assert.equal(brownieCake.items[0].size, "3 kg");
  for (const [size, expectedPrice] of [
    ["1kg", 11000],
    ["2kg", 16000],
    ["3kg", 21000],
  ]) {
    const order = validate({
      items: [
        {
          productId: "bolo-de-brownie",
          flavor: "Ninho com Nutella",
          size,
          quantity: 1,
        },
      ],
    });

    assert.equal(order.productsTotalCents, expectedPrice);
    assert.equal(order.items[0].unitPriceInCents, expectedPrice);
  }

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
  assert.equal(filledBrownieBonbonNinhoNutella.productsTotalCents, 13000);

  const filledBrownieBonbonPrestigio = validate({
    items: [
      {
        productId: "bombom-de-brownie",
        flavor: "Prestígio",
        quantity: 1,
      },
    ],
  });
  assert.equal(filledBrownieBonbonPrestigio.productsTotalCents, 12000);
  assert.equal(filledBrownieBonbonPrestigio.items[0].flavor, "Prestígio");

  const brownieRollNinhoNutella = validate({
    items: [
      {
        productId: "rocambole-de-brownie",
        flavor: "Ninho com Nutella",
        quantity: 1,
      },
    ],
  });
  const brownieRollPrestigio = validate({
    items: [
      {
        productId: "rocambole-de-brownie",
        flavor: "Prestígio",
        quantity: 1,
      },
    ],
  });
  assert.equal(brownieRollNinhoNutella.productsTotalCents, 10000);
  assert.equal(brownieRollPrestigio.productsTotalCents, 9000);

  const strawberryBonbon = validate({
    items: [{ productId: "bombom-de-morango", quantity: 1 }],
  });
  assert.equal(strawberryBonbon.productsTotalCents, 1000);

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
  assert.equal(persistedPotOrder.customerName, "Cliente de Teste");
  assert.equal(persistedPotOrder.requestedDate, minimumOrderDate);
  assert.equal(persistedPotOrder.fulfillmentType, "pickup");
  assert.equal(persistedPotOrder.notes, "Teste automatizado");
  assert.equal(persistedPotOrder.productsTotalCents, 7000);
  assert.deepEqual(persistedPotOrder.items, validatedPotOrders800g[0].items);
  assert.notEqual(persistedPotOrder.items, validatedPotOrders800g[0].items);
  assert.notEqual(
    persistedPotOrder.items[0],
    validatedPotOrders800g[0].items[0],
  );
  assert.match(preparedStatements[1].sql, /INSERT INTO order_items/);
  assert.deepEqual(preparedStatements[1].values, [
    "brownie-de-pote",
    "Brownie de pote",
    "Ninho com Nutella",
    "800 g",
    1,
    7000,
  ]);

  preparedStatements.length = 0;
  await createOrder(fakeDatabase, filledBrownieBonbonPrestigio);
  assert.match(preparedStatements[1].sql, /INSERT INTO order_items/);
  assert.deepEqual(preparedStatements[1].values, [
    "bombom-de-brownie",
    "Bombom de brownie com recheio",
    "Prestígio",
    null,
    1,
    12000,
  ]);

  const deliveryWhatsAppOrder = {
    orderId: 123,
    status: "pending_confirmation",
    customerName: "Guilherme",
    requestedDate: "2026-09-18",
    fulfillmentType: "delivery",
    notes: null,
    items: [
      {
        productId: "brownie-de-pote",
        productName: "Brownie de pote",
        flavor: "Ninho com Nutella",
        size: "300 g",
        quantity: 2,
        unitPriceInCents: 1800,
      },
      {
        productId: "rocambole-de-brownie",
        productName: "Rocambole de brownie",
        flavor: "Prestígio",
        size: null,
        quantity: 1,
        unitPriceInCents: 9000,
      },
    ],
    productsTotalCents: 12600,
  };
  const expectedDeliveryMessage = [
    "Olá, Gabi! Fiz um pedido pelo site da Brownieria Gabi Leal.",
    "",
    "Pedido #123",
    "Nome: Guilherme",
    "Data desejada para entrega: 18/09/2026",
    "Recebimento: Entrega",
    "",
    "Pedido:",
    "• 2x Brownie de pote — ± 300 g — Ninho com Nutella — R$ 36,00",
    "• 1x Rocambole de brownie — ± 800 g — Prestígio — R$ 90,00",
    "",
    "Total dos produtos: R$ 126,00",
    "Pagamento: 50% antecipadamente para confirmar o pedido e 50% no recebimento.",
    "",
    "Observações: Sem observações.",
    "",
    "A taxa e os detalhes da entrega serão combinados por aqui.",
    "",
    "Pode me confirmar os detalhes do pedido?",
  ].join("\n");
  const deliveryMessage = buildWhatsAppOrderMessage(deliveryWhatsAppOrder);
  const deliveryUrl = buildWhatsAppOrderUrl(deliveryWhatsAppOrder);
  const parsedDeliveryUrl = new URL(deliveryUrl);

  assert.equal(deliveryMessage, expectedDeliveryMessage);
  assert.equal(WHATSAPP_PHONE_NUMBER, "5581997175067");
  assert.equal(parsedDeliveryUrl.origin, "https://wa.me");
  assert.equal(parsedDeliveryUrl.pathname, "/5581997175067");
  assert.equal(parsedDeliveryUrl.searchParams.get("text"), deliveryMessage);
  assert.match(deliveryUrl, /\?text=.+%0A/);

  const pickupMessage = buildWhatsAppOrderMessage({
    ...deliveryWhatsAppOrder,
    orderId: 124,
    fulfillmentType: "pickup",
    notes: "Retirar após as 15h.",
  });
  assert.match(pickupMessage, /Pedido #124/);
  assert.match(
    pickupMessage,
    /Data desejada para retirada: 18\/09\/2026/,
  );
  assert.match(pickupMessage, /Recebimento: Retirada/);
  assert.match(
    pickupMessage,
    /O local e o horário da retirada serão combinados por aqui\./,
  );
  assert.doesNotMatch(pickupMessage, /taxa e os detalhes da entrega/i);
  assert.match(pickupMessage, /Observações: Retirar após as 15h\./);

  const noVariantMessage = buildWhatsAppOrderMessage({
    ...deliveryWhatsAppOrder,
    items: [
      {
        productId: "brownie-tradicional",
        productName: "Brownie tradicional",
        flavor: null,
        size: null,
        quantity: 1,
        unitPriceInCents: 600,
      },
    ],
    productsTotalCents: 600,
  });
  assert.match(noVariantMessage, /• 1x Brownie tradicional — R\$ 6,00/);
  assert.doesNotMatch(noVariantMessage, /—\s+—/);

  const persistedOrderUrl = buildWhatsAppOrderUrl(persistedPotOrder);
  validatedPotOrders800g[0].items[0].quantity = 3;
  assert.equal(persistedPotOrder.items[0].quantity, 1);
  assert.equal(buildWhatsAppOrderUrl(persistedPotOrder), persistedOrderUrl);

  const resetCalls = [];
  resetOrderFlow({
    clearCart: () => resetCalls.push("cart"),
    resetCheckout: () => resetCalls.push("checkout"),
    closeCart: () => resetCalls.push("close"),
  });
  assert.deepEqual(resetCalls, ["cart", "checkout", "close"]);

  const orderSuccessSource = readFileSync(
    path.join(projectRoot, "src/components/checkout/order-success.tsx"),
    "utf8",
  );
  const cartDrawerSource = readFileSync(
    path.join(projectRoot, "src/components/cart/cart-drawer.tsx"),
    "utf8",
  );
  const whatsappLink = orderSuccessSource.match(
    /<a[\s\S]*?Enviar pedido pelo WhatsApp[\s\S]*?<\/a>/,
  );
  assert.ok(whatsappLink);
  assert.match(whatsappLink[0], /target="_blank"/);
  assert.match(whatsappLink[0], /rel="noopener noreferrer"/);
  assert.doesNotMatch(whatsappLink[0], /onClick=/);
  assert.doesNotMatch(orderSuccessSource, /submitOrder|clearCart/);
  assert.match(orderSuccessSource, /Fazer novo pedido/);
  assert.match(
    cartDrawerSource,
    /activeStep === "success" && createdOrder/,
  );

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
        flavor: "Prestígio",
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
        productId: "rocambole-de-brownie",
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
        flavor: "Prestígio",
        size: "1kg",
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
