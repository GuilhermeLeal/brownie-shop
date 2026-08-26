"use client";

import { useState, type FormEvent } from "react";

import { useCheckout } from "@/contexts/checkout-context";
import { useLocalToday } from "@/hooks/use-local-today";
import type {
  FulfillmentMethod,
  OrderDetailsErrors,
  OrderDetailsField,
} from "@/types/checkout";
import { getLocalDateInputValue } from "@/utils/date";
import { formatPhone, normalizePhone } from "@/utils/phone";
import { validateOrderDetails } from "@/utils/validate-order-details";

const fieldIds: Record<OrderDetailsField, string> = {
  name: "checkout-name",
  phone: "checkout-phone",
  desiredDate: "checkout-date",
  fulfillmentMethod: "checkout-delivery",
  address: "checkout-address",
};

const inputStyles =
  "mt-2 min-h-12 w-full rounded-2xl border border-chocolate/15 bg-white px-4 py-3 text-base text-chocolate outline-none transition placeholder:text-chocolate/35 hover:border-chocolate/30 focus:border-chocolate focus:ring-2 focus:ring-primary/45 aria-invalid:border-primary aria-invalid:ring-2 aria-invalid:ring-primary/35";

type CheckoutFormProps = {
  onBack: () => void;
  onReview: () => void;
};

export function CheckoutForm({ onBack, onReview }: CheckoutFormProps) {
  const { orderDetails, updateOrderDetails } = useCheckout();
  const [errors, setErrors] = useState<OrderDetailsErrors>({});
  const localToday = useLocalToday();
  const isSameDay =
    Boolean(localToday) && orderDetails.desiredDate === localToday;
  const isDelivery = orderDetails.fulfillmentMethod === "delivery";

  function clearError(field: OrderDetailsField) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function chooseFulfillmentMethod(method: FulfillmentMethod) {
    updateOrderDetails({
      fulfillmentMethod: method,
      ...(method === "pickup" ? { address: "" } : {}),
    });
    clearError("fulfillmentMethod");

    if (method === "pickup") {
      clearError("address");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const today = localToday || getLocalDateInputValue();
    const nextErrors = validateOrderDetails(orderDetails, today);
    const firstInvalidField = Object.keys(nextErrors)[0] as
      | OrderDetailsField
      | undefined;

    setErrors(nextErrors);

    if (firstInvalidField) {
      document.getElementById(fieldIds[firstInvalidField])?.focus();
      return;
    }

    updateOrderDetails({
      name: orderDetails.name.trim(),
      address: orderDetails.address.trim(),
      notes: orderDetails.notes.trim(),
    });
    onReview();
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
        <p className="mb-6 text-sm leading-6 text-chocolate/65">
          Conte como prefere receber seus doces. Você poderá revisar tudo antes
          de finalizar.
        </p>

        <div className="space-y-5">
          <div>
            <label htmlFor="checkout-name" className="text-sm font-bold">
              Nome
            </label>
            <input
              id="checkout-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={orderDetails.name}
              onChange={(event) => {
                updateOrderDetails({ name: event.target.value });
                clearError("name");
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "checkout-name-error" : undefined}
              className={inputStyles}
            />
            {errors.name && (
              <p
                id="checkout-name-error"
                role="alert"
                className="mt-2 text-sm font-semibold"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="checkout-phone" className="text-sm font-bold">
              Telefone
            </label>
            <input
              id="checkout-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="(00) 00000-0000"
              value={formatPhone(orderDetails.phone)}
              onChange={(event) => {
                updateOrderDetails({ phone: normalizePhone(event.target.value) });
                clearError("phone");
              }}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? "checkout-phone-error" : undefined
              }
              className={inputStyles}
            />
            {errors.phone && (
              <p
                id="checkout-phone-error"
                role="alert"
                className="mt-2 text-sm font-semibold"
              >
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="checkout-date" className="text-sm font-bold">
              Data desejada
            </label>
            <input
              id="checkout-date"
              name="desiredDate"
              type="date"
              required
              min={localToday || undefined}
              value={orderDetails.desiredDate}
              onChange={(event) => {
                updateOrderDetails({ desiredDate: event.target.value });
                clearError("desiredDate");
              }}
              aria-invalid={Boolean(errors.desiredDate)}
              aria-describedby={
                errors.desiredDate
                  ? "checkout-date-error"
                  : isSameDay
                    ? "same-day-notice"
                    : undefined
              }
              className={inputStyles}
            />
            {errors.desiredDate && (
              <p
                id="checkout-date-error"
                role="alert"
                className="mt-2 text-sm font-semibold"
              >
                {errors.desiredDate}
              </p>
            )}
          </div>

          {isSameDay && (
            <aside
              id="same-day-notice"
              className="rounded-[1.5rem] bg-primary/25 p-4 ring-1 ring-primary/45"
              aria-live="polite"
            >
              <p className="font-heading text-lg font-bold">Pedido para hoje</p>
              <p className="mt-1 text-sm leading-6 text-chocolate/75">
                Pedidos realizados para o mesmo dia estão sujeitos à
                disponibilidade dos produtos. A disponibilidade deverá ser
                confirmada com a responsável pelo pedido.
              </p>
            </aside>
          )}

          <fieldset
            aria-invalid={Boolean(errors.fulfillmentMethod)}
            aria-describedby={
              errors.fulfillmentMethod
                ? "checkout-fulfillment-error"
                : undefined
            }
          >
            <legend className="text-sm font-bold">Forma de recebimento</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  ["delivery", "Entrega"],
                  ["pickup", "Retirada"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="relative cursor-pointer">
                  <input
                    id={value === "delivery" ? "checkout-delivery" : undefined}
                    type="radio"
                    name="fulfillmentMethod"
                    value={value}
                    checked={orderDetails.fulfillmentMethod === value}
                    onChange={() => chooseFulfillmentMethod(value)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-chocolate/15 bg-white px-4 py-3 font-semibold transition hover:border-chocolate/35 peer-checked:border-chocolate peer-checked:bg-secondary/25 peer-focus-visible:ring-2 peer-focus-visible:ring-chocolate peer-focus-visible:ring-offset-2">
                    <span
                      className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-chocolate/40 peer-checked:border-chocolate"
                      aria-hidden="true"
                    >
                      <span
                        className={`size-2.5 rounded-full bg-chocolate ${
                          orderDetails.fulfillmentMethod === value
                            ? "block"
                            : "hidden"
                        }`}
                      />
                    </span>
                    {label}
                  </span>
                </label>
              ))}
            </div>
            {errors.fulfillmentMethod && (
              <p
                id="checkout-fulfillment-error"
                role="alert"
                className="mt-2 text-sm font-semibold"
              >
                {errors.fulfillmentMethod}
              </p>
            )}
          </fieldset>

          {isDelivery && (
            <div>
              <label htmlFor="checkout-address" className="text-sm font-bold">
                Endereço para entrega
              </label>
              <textarea
                id="checkout-address"
                name="address"
                autoComplete="street-address"
                required
                rows={3}
                value={orderDetails.address}
                onChange={(event) => {
                  updateOrderDetails({ address: event.target.value });
                  clearError("address");
                }}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address ? "checkout-address-error" : undefined
                }
                className={`${inputStyles} resize-y`}
              />
              {errors.address && (
                <p
                  id="checkout-address-error"
                  role="alert"
                  className="mt-2 text-sm font-semibold"
                >
                  {errors.address}
                </p>
              )}
            </div>
          )}

          {isDelivery && (
            <aside className="rounded-[1.5rem] bg-secondary/25 p-4 ring-1 ring-secondary/45">
              <p className="font-bold">Sobre a entrega</p>
              <p className="mt-1 text-sm leading-6 text-chocolate/75">
                A taxa de entrega é de responsabilidade do cliente e não está
                incluída no total dos produtos.
              </p>
            </aside>
          )}

          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="checkout-notes" className="text-sm font-bold">
                Observações <span className="font-normal">(opcional)</span>
              </label>
              <span className="text-xs text-chocolate/50" aria-hidden="true">
                {orderDetails.notes.length}/500
              </span>
            </div>
            <textarea
              id="checkout-notes"
              name="notes"
              rows={4}
              maxLength={500}
              value={orderDetails.notes}
              onChange={(event) =>
                updateOrderDetails({ notes: event.target.value })
              }
              className={`${inputStyles} resize-y`}
            />
          </div>

          <aside className="rounded-[1.5rem] bg-background p-4">
            <p className="font-bold">Pagamento no recebimento</p>
            <p className="mt-1 text-sm leading-6 text-chocolate/70">
              O pagamento será realizado no momento do recebimento do pedido.
              Não há pagamento online neste site.
            </p>
          </aside>
        </div>
      </div>

      <footer className="grid grid-cols-2 gap-3 border-t border-chocolate/10 bg-white px-5 py-5 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 cursor-pointer rounded-full border border-chocolate/20 px-4 py-3 font-bold transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="min-h-12 cursor-pointer rounded-full bg-chocolate px-4 py-3 font-bold text-white transition-colors hover:bg-primary hover:text-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2"
        >
          Revisar pedido
        </button>
      </footer>
    </form>
  );
}
