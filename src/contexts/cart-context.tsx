"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalInCents: number;
  isCartOpen: boolean;
  addProduct: (product: Product, flavor?: string) => boolean;
  removeItem: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function createCartItemId(productId: string, flavor?: string) {
  return flavor ? `${productId}::${flavor}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addProduct = useCallback((product: Product, flavor?: string) => {
    const selectedFlavor = flavor?.trim() || undefined;

    if (product.flavors?.length) {
      if (!selectedFlavor || !product.flavors.includes(selectedFlavor)) {
        return false;
      }
    } else if (selectedFlavor) {
      return false;
    }

    const itemId = createCartItemId(product.id, selectedFlavor);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...currentItems,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          unitPriceInCents: product.priceInCents,
          quantity: 1,
          flavor: selectedFlavor,
        },
      ];
    });

    return true;
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }, []);

  const increaseQuantity = useCallback((itemId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((itemId: string) => {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return item.quantity === 1
          ? []
          : [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalInCents = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.unitPriceInCents * item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      totalInCents,
      isCartOpen,
      addProduct,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      totalQuantity,
      totalInCents,
      isCartOpen,
      addProduct,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}
