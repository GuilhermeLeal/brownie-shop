"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from "react";

type ClearCartModalProps = {
  isOpen: boolean;
  itemCount: number;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ClearCartModal({
  isOpen,
  itemCount,
  triggerRef,
  onCancel,
  onConfirm,
}: ClearCartModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  const restorePageScroll = useCallback(() => {
    if (previousBodyOverflowRef.current === null) {
      return;
    }

    document.body.style.overflow = previousBodyOverflowRef.current;
    previousBodyOverflowRef.current = null;
  }, []);

  const restoreFocus = useCallback(() => {
    if (triggerRef.current?.isConnected) {
      triggerRef.current.focus();
      return;
    }

    document
      .querySelector<HTMLButtonElement>(
        '#cart-drawer button[aria-label="Fechar pedido"]',
      )
      ?.focus();
  }, [triggerRef]);

  const finishClosing = useCallback(() => {
    const dialog = dialogRef.current;

    if (!dialog || dialog.dataset.state !== "closing") {
      return;
    }

    dialog.close();
    dialog.dataset.state = "closed";
    restorePageScroll();
    restoreFocus();
  }, [restoreFocus, restorePageScroll]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (!isOpen) {
      if (dialog.open) {
        dialog.dataset.state = "closing";

        const modal =
          dialog.querySelector<HTMLElement>(".clear-cart-modal");
        const closingAnimations = modal?.getAnimations() ?? [];

        if (closingAnimations.length === 0) {
          finishClosing();
        } else {
          void Promise.allSettled(
            closingAnimations.map((animation) => animation.finished),
          ).then(finishClosing);
        }
      }
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    dialog.dataset.state = "open";

    if (previousBodyOverflowRef.current === null) {
      previousBodyOverflowRef.current = document.body.style.overflow;
    }

    document.body.style.overflow = "hidden";
  }, [finishClosing, isOpen]);

  useEffect(() => {
    return () => {
      restorePageScroll();
    };
  }, [restorePageScroll]);

  return (
    <dialog
      ref={dialogRef}
      className="clear-cart-dialog fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md overflow-visible bg-transparent p-0 text-chocolate backdrop:bg-chocolate/45 backdrop:backdrop-blur-[2px]"
      aria-modal="true"
      aria-labelledby="clear-cart-modal-title"
      aria-describedby="clear-cart-modal-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.dataset.state = "closed";
        }

        restorePageScroll();
        restoreFocus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section className="clear-cart-modal rounded-[2rem] bg-background p-6 shadow-2xl ring-1 ring-white/60 sm:rounded-[2.5rem] sm:p-8">
        <span
          className="flex size-11 items-center justify-center rounded-full bg-primary/35"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5M14 11v5" />
          </svg>
        </span>

        <h2
          id="clear-cart-modal-title"
          className="mt-5 font-heading text-2xl font-bold sm:text-3xl"
        >
          Limpar pedido?
        </h2>
        <p
          id="clear-cart-modal-description"
          className="mt-3 text-sm leading-6 text-chocolate/70 sm:text-base"
        >
          Seu pedido possui {itemCount} {itemCount === 1 ? "item" : "itens"}.
          Todos eles serão removidos.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="min-h-12 cursor-pointer rounded-full border border-chocolate/20 bg-white px-5 py-3 font-bold transition-colors hover:bg-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Continuar com o pedido
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-12 cursor-pointer rounded-full bg-primary px-5 py-3 font-bold transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Limpar pedido
          </button>
        </div>
      </section>
    </dialog>
  );
}
