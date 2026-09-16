import { PrivacyModal } from "@/components/home/privacy-modal";

export function Footer() {
  return (
    <footer className="bg-chocolate text-white">
      <div className="site-container py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="font-heading text-2xl font-bold">Brownieria Gabi Leal</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
              Um cantinho para doces feitos com cuidado e carinho.
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm font-semibold">Redes e contato</p>
            <div className="mt-2 space-y-2 text-sm text-white/65">
              <p>
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/brownieriagabileal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chocolate"
                >
                  @brownieriagabileal
                </a>
              </p>
              <p>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/5581997175067"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chocolate"
                >
                  Fazer pedido
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/15 pt-6">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Brownies &amp; Doces.
          </p>
          <PrivacyModal />
        </div>
      </div>
    </footer>
  );
}
