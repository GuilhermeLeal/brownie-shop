"use client";

import { useCart } from "@/contexts/cart-context";
import { useCheckout } from "@/contexts/checkout-context";
import { useLocalToday } from "@/hooks/use-local-today";
import { getCartItemVariantLabel } from "@/utils/cart-item";
import { formatCurrency } from "@/utils/format-currency";
import { formatDateInputValue } from "@/utils/date";
import { formatPhone } from "@/utils/phone";

type OrderReviewProps = {
  onBack: () => void;
};

export function OrderReview({ onBack }: OrderReviewProps) {
  const { items, totalQuantity, totalInCents } = useCart();
  const { orderDetails } = useCheckout();
  const localToday = useLocalToday();
  const isDelivery = orderDetails.fulfillmentMethod === "delivery";
  const isSameDay =
    Boolean(localToday) && orderDetails.desiredDate === localToday;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
        {isSameDay && (
          <aside className="rounded-[1.5rem] bg-primary/25 p-4 ring-1 ring-primary/45">
            <p className="font-heading text-lg font-bold">
              Pedido para hoje — sujeito à disponibilidade
            </p>
            <p className="mt-1 text-sm leading-6 text-chocolate/75">
              A disponibilidade dos produtos deverá ser confirmada com a
              responsável pelo pedido.
            </p>
          </aside>
        )}

        <section
          className="rounded-[1.5rem] bg-background p-5"
          aria-labelledby="review-client-title"
        >
          <h3
            id="review-client-title"
            className="font-heading text-xl font-bold"
          >
            Cliente
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-chocolate/55">Nome</dt>
              <dd className="mt-1">{orderDetails.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-chocolate/55">Telefone</dt>
              <dd className="mt-1">{formatPhone(orderDetails.phone)}</dd>
            </div>
          </dl>
        </section>

        <section
          className="rounded-[1.5rem] bg-secondary/20 p-5"
          aria-labelledby="review-fulfillment-title"
        >
          <h3
            id="review-fulfillment-title"
            className="font-heading text-xl font-bold"
          >
            Recebimento
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-chocolate/55">Data</dt>
              <dd className="mt-1">
                {formatDateInputValue(orderDetails.desiredDate)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-chocolate/55">Forma</dt>
              <dd className="mt-1">{isDelivery ? "Entrega" : "Retirada"}</dd>
            </div>
            {isDelivery && (
              <div>
                <dt className="font-semibold text-chocolate/55">Endereço</dt>
                <dd className="mt-1 whitespace-pre-line break-words">
                  {orderDetails.address}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section
          className="rounded-[1.5rem] border border-chocolate/10 bg-white p-5"
          aria-labelledby="review-products-title"
        >
          <div className="flex items-end justify-between gap-4">
            <h3
              id="review-products-title"
              className="font-heading text-xl font-bold"
            >
              Produtos
            </h3>
            <p className="text-xs font-semibold text-chocolate/55">
              {totalQuantity} {totalQuantity === 1 ? "item" : "itens"}
            </p>
          </div>
          <ul className="mt-4 divide-y divide-chocolate/10">
            {items.map((item) => {
              const variantLabel = getCartItemVariantLabel(item);

              return (
                <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      {variantLabel && (
                        <p className="mt-1 text-sm text-chocolate/60">
                          {variantLabel}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-chocolate/60">
                        {item.quantity} × {formatCurrency(item.unitPriceInCents)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold">
                      {formatCurrency(item.unitPriceInCents * item.quantity)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section
          className="rounded-[1.5rem] bg-primary/20 p-5"
          aria-labelledby="review-values-title"
        >
          <h3
            id="review-values-title"
            className="font-heading text-xl font-bold"
          >
            Valores
          </h3>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="font-semibold">Total dos produtos</p>
            <p className="font-heading text-xl font-bold">
              {formatCurrency(totalInCents)}
            </p>
          </div>
          {isDelivery && (
            <p className="mt-3 border-t border-chocolate/10 pt-3 text-sm leading-6 text-chocolate/70">
              A taxa de entrega não está incluída e é de responsabilidade do
              cliente.
            </p>
          )}
        </section>

        {orderDetails.notes && (
          <section
            className="rounded-[1.5rem] bg-background p-5"
            aria-labelledby="review-notes-title"
          >
            <h3
              id="review-notes-title"
              className="font-heading text-xl font-bold"
            >
              Observações
            </h3>
            <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-chocolate/75">
              {orderDetails.notes}
            </p>
          </section>
        )}

        <aside className="rounded-[1.5rem] bg-background p-4">
          <p className="font-bold">Pagamento no recebimento</p>
          <p className="mt-1 text-sm leading-6 text-chocolate/70">
            O pagamento será realizado no momento do recebimento do pedido.
          </p>
        </aside>
      </div>

      <footer className="border-t border-chocolate/10 bg-white px-5 py-5 sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-12 cursor-pointer rounded-full border border-chocolate/20 px-4 py-3 font-bold transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2"
          >
            Voltar e editar
          </button>
          <button
            type="button"
            disabled
            aria-describedby="finalization-pending-note"
            className="min-h-12 cursor-not-allowed rounded-full bg-chocolate px-4 py-3 font-bold text-white opacity-55"
          >
            Finalizar pedido
          </button>
        </div>
        <p
          id="finalization-pending-note"
          className="mt-3 text-center text-xs leading-5 text-chocolate/55"
        >
          A confirmação do pedido será habilitada na próxima etapa.
        </p>
      </footer>
    </div>
  );
}
