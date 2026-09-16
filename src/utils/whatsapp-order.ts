import { products } from "@/data/products";
import type { CreatedOrder, CreatedOrderItem } from "@/types/order";
import { formatCurrency } from "@/utils/format-currency";
import { formatDateInputValue } from "@/utils/date";
import {
  extractApproximateWeight,
  formatApproximateWeight,
} from "@/utils/format-weight";

export const WHATSAPP_PHONE_NUMBER = "5581997175067";

const productsById = new Map(products.map((product) => [product.id, product]));

function formatMessageCurrency(valueInCents: number) {
  return formatCurrency(valueInCents).replace(/\u00a0/g, " ");
}

function getItemWeight(item: CreatedOrderItem) {
  if (item.size) {
    return formatApproximateWeight(item.size);
  }

  if (extractApproximateWeight(item.productName)) {
    return null;
  }

  const product = productsById.get(item.productId);

  return product ? extractApproximateWeight(product.description) : null;
}

function formatOrderItem(item: CreatedOrderItem) {
  const parts = [
    `${item.quantity}x ${formatApproximateWeight(item.productName)}`,
    getItemWeight(item),
    item.flavor,
    formatMessageCurrency(item.quantity * item.unitPriceInCents),
  ].filter((part): part is string => Boolean(part));

  return `• ${parts.join(" — ")}`;
}

export function buildWhatsAppOrderMessage(order: CreatedOrder) {
  const isDelivery = order.fulfillmentType === "delivery";
  const fulfillmentLabel = isDelivery ? "Entrega" : "Retirada";
  const requestedDateLabel = isDelivery
    ? "Data desejada para entrega"
    : "Data desejada para retirada";
  const fulfillmentNotice = isDelivery
    ? "A taxa e os detalhes da entrega serão combinados por aqui."
    : "O local e o horário da retirada serão combinados por aqui.";
  const notes = order.notes?.trim() || "Sem observações.";

  return [
    "Olá, Gabi! Fiz um pedido pelo site da Brownieria Gabi Leal.",
    "",
    `Pedido #${order.orderId}`,
    `Nome: ${order.customerName}`,
    `${requestedDateLabel}: ${formatDateInputValue(order.requestedDate)}`,
    `Recebimento: ${fulfillmentLabel}`,
    "",
    "Pedido:",
    ...order.items.map(formatOrderItem),
    "",
    `Total dos produtos: ${formatMessageCurrency(order.productsTotalCents)}`,
    "Pagamento: 50% antecipadamente para confirmar o pedido e 50% no recebimento.",
    "",
    `Observações: ${notes}`,
    "",
    fulfillmentNotice,
    "",
    "Pode me confirmar os detalhes do pedido?",
  ].join("\n");
}

export function buildWhatsAppOrderUrl(order: CreatedOrder) {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppOrderMessage(order),
  )}`;
}
