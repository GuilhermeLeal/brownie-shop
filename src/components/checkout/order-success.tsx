"use client";

import type { CreatedOrder } from "@/types/order";
import { buildWhatsAppOrderUrl } from "@/utils/whatsapp-order";

type OrderSuccessProps = {
  order: CreatedOrder;
  onStartNewOrder: () => void;
};

export function OrderSuccess({ order, onStartNewOrder }: OrderSuccessProps) {
  const whatsappUrl = buildWhatsAppOrderUrl(order);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 items-center overflow-y-auto px-5 py-8 sm:px-6">
        <div className="w-full rounded-[2rem] bg-background p-6 text-center sm:p-8">
          <span
            className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/35"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-7"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          <h3 className="mt-5 font-heading text-4xl font-bold">
            Pedido #{order.orderId} criado!
          </h3>
          <p className="mx-auto mt-3 max-w-sm leading-7 text-chocolate/70">
            Agora envie seu pedido pelo WhatsApp para combinar os detalhes com
            a Gabi.
          </p>
        </div>
      </div>

      <footer className="border-t border-chocolate/10 bg-white px-5 py-5 sm:px-6">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-5 py-3 text-center font-bold text-white transition-colors hover:bg-primary hover:text-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2"
        >
          Enviar pedido pelo WhatsApp
        </a>
        <button
          type="button"
          onClick={onStartNewOrder}
          className="mt-3 min-h-11 w-full cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-chocolate/70 underline decoration-chocolate/30 underline-offset-4 transition-colors hover:bg-background hover:text-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2"
        >
          Fazer novo pedido
        </button>
      </footer>
    </div>
  );
}
