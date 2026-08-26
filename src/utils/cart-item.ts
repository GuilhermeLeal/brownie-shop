import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { resolveProductSelection } from "@/utils/product-price";

export function createCartItemId(productId: string, flavor?: string) {
  return flavor ? `${productId}::${flavor}` : productId;
}

export function createCartItem(
  product: Product,
  selectedFlavor?: string,
): CartItem | null {
  const selection = resolveProductSelection(product, selectedFlavor);

  if (!selection) {
    return null;
  }

  return {
    id: createCartItemId(product.id, selection.flavor),
    productId: product.id,
    name: product.name,
    unitPriceInCents: selection.unitPriceInCents,
    quantity: 1,
    flavor: selection.flavor,
  };
}
