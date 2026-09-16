import type { Metadata } from "next";
import { Figtree, Gabarito } from "next/font/google";

import { CartProvider } from "@/contexts/cart-context";
import { CheckoutProvider } from "@/contexts/checkout-context";

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
  metadataBase: new URL("https://brownieriagabileal.shop"),
  title: "Brownieria Gabi Leal | Brownies Artesanais",
  description:
    "Brownies artesanais feitos com carinho, sabores especiais, bolos de brownie, rocamboles e muito mais. Faça seu pedido na Brownieria Gabi Leal.",
  alternates: {
    canonical: "https://brownieriagabileal.shop",
  },
  openGraph: {
    title: "Brownieria Gabi Leal | Brownies Artesanais",
    description:
      "Brownies artesanais feitos com carinho, sabores especiais e opções para deixar qualquer momento mais gostoso.",
    url: "https://brownieriagabileal.shop",
    siteName: "Brownieria Gabi Leal",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/brand/logo-brownieria-gabi-leal.png",
        alt: "Brownieria Gabi Leal - Doces artesanais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brownieria Gabi Leal | Brownies Artesanais",
    description:
      "Brownies artesanais feitos com carinho, sabores especiais e opções para deixar qualquer momento mais gostoso.",
    images: [
      {
        url: "/images/brand/logo-brownieria-gabi-leal.png",
        alt: "Brownieria Gabi Leal - Doces artesanais",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${gabarito.variable}`}>
      <body>
        <CartProvider>
          <CheckoutProvider>{children}</CheckoutProvider>
        </CartProvider>
      </body>
    </html>
  );
}
