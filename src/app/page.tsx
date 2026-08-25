import { AboutOwner } from "@/components/home/about-owner";
import { BestSellers } from "@/components/home/best-sellers";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingCartButton } from "@/components/cart/floating-cart-button";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { MenuCallout } from "@/components/home/menu-callout";
import { MenuSection } from "@/components/home/menu-section";

export default function Home() {
  return (
    <>
      <Header />
      <CartDrawer />
      <FloatingCartButton />
      <main id="conteudo-principal">
        <Hero />
        <BestSellers />
        <MenuCallout />
        <MenuSection />
        <AboutOwner />
      </main>
      <Footer />
    </>
  );
}
