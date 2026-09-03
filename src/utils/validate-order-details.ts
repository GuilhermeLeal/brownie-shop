import type {
  OrderDetails,
  OrderDetailsErrors,
} from "@/types/checkout";
import { isValidDateInputValue } from "@/utils/date";
import { isValidBrazilianPhone } from "@/utils/phone";

export function validateOrderDetails(
  details: OrderDetails,
  minimumOrderDate: string,
) {
  const errors: OrderDetailsErrors = {};

  if (!details.name.trim()) {
    errors.name = "Informe seu nome.";
  }

  if (!details.phone) {
    errors.phone = "Informe seu telefone.";
  } else if (!isValidBrazilianPhone(details.phone)) {
    errors.phone = "Informe um telefone brasileiro válido com DDD.";
  }

  if (!details.desiredDate) {
    errors.desiredDate = "Escolha a data desejada.";
  } else if (!isValidDateInputValue(details.desiredDate)) {
    errors.desiredDate = "Informe uma data válida.";
  } else if (details.desiredDate < minimumOrderDate) {
    errors.desiredDate =
      "Escolha uma data com pelo menos 2 dias de antecedência.";
  }

  if (!details.fulfillmentMethod) {
    errors.fulfillmentMethod = "Escolha entrega ou retirada.";
  }

  return errors;
}
