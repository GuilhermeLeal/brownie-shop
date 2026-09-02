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
import { addOrIncrementCartItem, createCartItem } from "@/utils/cart-item";
import type { ProductSelection } from "@/utils/product-price";

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalInCents: number;
  isCartOpen: boolean;
  addProduct: (product: Product, selection?: ProductSelection) => boolean;
  removeItem: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addProduct = useCallback(
    (product: Product, selection?: ProductSelection) => {
      const newItem = createCartItem(product, selection);

      if (!newItem) {
        return false;
      }

      setItems((currentItems) =>
        addOrIncrementCartItem(currentItems, newItem),
      );

      return true;
    },
    [],
  );

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
