"use client";

import type { CreatedOrder } from "@/types/order";
import { formatCurrency } from "@/utils/format-currency";

type OrderSuccessProps = {
  order: CreatedOrder;
  onClose: () => void;
};

export function OrderSuccess({ order, onClose }: OrderSuccessProps) {
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
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-chocolate/55">
            Pedido registrado
          </p>
          <h3 className="mt-2 font-heading text-4xl font-bold">
            Pedido #{order.orderId} criado
          </h3>
          <p className="mx-auto mt-3 max-w-sm leading-7 text-chocolate/70">
            Seu pedido foi registrado com sucesso.
          </p>

          <dl className="mt-6 space-y-3 rounded-[1.5rem] bg-white p-5 text-left">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm font-semibold text-chocolate/60">Status</dt>
              <dd className="font-bold">Aguardando confirmação</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-chocolate/10 pt-3">
              <dt className="text-sm font-semibold text-chocolate/60">
                Total dos produtos
              </dt>
              <dd className="font-heading text-xl font-bold">
                {formatCurrency(order.productsTotalCents)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-sm leading-6 text-chocolate/65">
            Na próxima etapa, este pedido será enviado para confirmação pelo
            WhatsApp.
          </p>
        </div>
      </div>

      <footer className="border-t border-chocolate/10 bg-white px-5 py-5 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="min-h-12 w-full cursor-pointer rounded-full bg-chocolate px-5 py-3 font-bold text-white transition-colors hover:bg-primary hover:text-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2"
        >
          Fechar
        </button>
      </footer>
    </div>
  );
}
