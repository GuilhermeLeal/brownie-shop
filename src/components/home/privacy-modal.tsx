"use client";

import { useCallback, useEffect, useRef } from "react";

export function PrivacyModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  const restorePageScroll = useCallback(() => {
    if (previousBodyOverflowRef.current === null) {
      return;
    }

    document.body.style.overflow = previousBodyOverflowRef.current;
    previousBodyOverflowRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      restorePageScroll();
    };
  }, [restorePageScroll]);

  function openModal() {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) {
      return;
    }

    dialog.showModal();
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        aria-haspopup="dialog"
        aria-controls="privacy-modal"
        className="inline-flex min-h-10 cursor-pointer items-center rounded-sm px-1 text-xs text-white/60 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chocolate"
      >
        Privacidade
      </button>

      <dialog
        ref={dialogRef}
        id="privacy-modal"
        className="fixed inset-0 m-auto max-h-none w-[calc(100%-2rem)] max-w-lg overflow-visible bg-transparent p-0 text-chocolate backdrop:bg-chocolate/45 backdrop:backdrop-blur-[2px]"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        aria-describedby="privacy-modal-description"
        onCancel={(event) => {
          event.preventDefault();
          closeModal();
        }}
        onClose={() => {
          restorePageScroll();
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
      >
        <section className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[2rem] bg-background p-6 shadow-2xl ring-1 ring-white/60 sm:rounded-[2.5rem] sm:p-8">
          <h2
            id="privacy-modal-title"
            className="font-heading text-2xl font-bold sm:text-3xl"
          >
            Privacidade
          </h2>
          <p
            id="privacy-modal-description"
            className="mt-3 text-sm leading-6 text-chocolate/70 sm:text-base"
          >
            Os dados informados durante o pedido, como nome e telefone, são
            utilizados exclusivamente para processar o pedido e entrar em contato
            com o cliente. As informações são armazenadas de forma segura e não
            são vendidas ou utilizadas para publicidade de terceiros. Para dúvidas
            ou solicitações relacionadas aos seus dados, entre em contato com a
            Brownieria Gabi Leal pelo WhatsApp.
          </p>
          <button
            type="button"
            onClick={closeModal}
            autoFocus
            className="mt-7 min-h-12 w-full cursor-pointer rounded-full bg-primary px-5 py-3 font-bold transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:min-w-32"
          >
            Fechar
          </button>
        </section>
      </dialog>
    </>
  );
}
