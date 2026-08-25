import type { Metadata } from "next";
import { Figtree, Gabarito } from "next/font/google";

import { CartProvider } from "@/contexts/cart-context";
import { OrderModeProvider } from "@/contexts/order-mode-context";

import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brownies & Doces",
  description: "Cardápio de brownies e doces.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${gabarito.variable}`}>
      <body>
        <OrderModeProvider>
          <CartProvider>{children}</CartProvider>
        </OrderModeProvider>
      </body>
    </html>
  );
}
