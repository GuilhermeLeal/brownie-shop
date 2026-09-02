import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import {
  resolveProductSelection,
  type ProductSelection,
} from "@/utils/product-price";

export function createCartItemId(
  productId: string,
  selection: Pick<CartItem, "flavor" | "size">,
) {
  const variants = [
    selection.flavor
      ? `flavor=${encodeURIComponent(selection.flavor)}`
      : null,
    selection.size
      ? `size=${encodeURIComponent(selection.size.value)}`
      : null,
  ].filter(Boolean);

  return [productId, ...variants].join("::");
}

export function createCartItem(
  product: Product,
  selectedOptions: ProductSelection = {},
): CartItem | null {
  const selection = resolveProductSelection(product, selectedOptions);

  if (!selection) {
    return null;
  }

  return {
    id: createCartItemId(product.id, selection),
    productId: product.id,
    name: product.name,
    unitPriceInCents: selection.unitPriceInCents,
    quantity: 1,
    flavor: selection.flavor,
    size: selection.size,
  };
}

export function addOrIncrementCartItem(
  items: CartItem[],
  newItem: CartItem,
) {
  const existingItem = items.find((item) => item.id === newItem.id);

  return existingItem
    ? items.map((item) =>
        item.id === newItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...items, newItem];
}

export function getCartItemVariantLabel(item: CartItem) {
  return [item.flavor, item.size?.label].filter(Boolean).join(" • ") || null;
}
