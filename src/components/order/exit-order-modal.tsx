"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from "react";

type ExitOrderModalProps = {
  isOpen: boolean;
  itemCount: number;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ExitOrderModal({
  isOpen,
  itemCount,
  triggerRef,
  onCancel,
  onConfirm,
}: ExitOrderModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  const restorePageScroll = useCallback(() => {
    if (previousBodyOverflowRef.current === null) {
      return;
    }

    document.body.style.overflow = previousBodyOverflowRef.current;
    previousBodyOverflowRef.current = null;
  }, []);

  const restoreTriggerFocus = useCallback(() => {
    triggerRef.current?.focus();
  }, [triggerRef]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (!isOpen) {
      if (dialog.open) {
        dialog.dataset.state = "closing";
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
  }, [isOpen]);

  useEffect(() => {
    return () => {
      restorePageScroll();
    };
  }, [restorePageScroll]);

  function finishClosing() {
    const dialog = dialogRef.current;

    if (!dialog || dialog.dataset.state !== "closing") {
      return;
    }

    dialog.close();
    dialog.dataset.state = "closed";
    restorePageScroll();
    restoreTriggerFocus();
  }

  return (
    <dialog
      ref={dialogRef}
      className="exit-order-dialog fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md overflow-visible bg-transparent p-0 text-chocolate backdrop:bg-chocolate/45 backdrop:backdrop-blur-[2px]"
      aria-modal="true"
      aria-labelledby="exit-order-modal-title"
      aria-describedby="exit-order-modal-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.dataset.state = "closed";
        }

        restorePageScroll();
        restoreTriggerFocus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section
        className="exit-order-modal rounded-[2rem] bg-background p-6 shadow-2xl ring-1 ring-white/60 sm:rounded-[2.5rem] sm:p-8"
        onAnimationEnd={(event) => {
          if (event.currentTarget === event.target) {
            finishClosing();
          }
        }}
      >
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
            <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M18 12H9" />
          </svg>
        </span>

        <h2
          id="exit-order-modal-title"
          className="mt-5 font-heading text-2xl font-bold sm:text-3xl"
        >
          Sair do modo pedido?
        </h2>
        <p
          id="exit-order-modal-description"
          className="mt-3 text-sm leading-6 text-chocolate/70 sm:text-base"
        >
          Seu pedido possui {itemCount} {itemCount === 1 ? "item" : "itens"}.
          Ao sair, todos os itens adicionados serão removidos.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="min-h-12 cursor-pointer rounded-full border border-chocolate/20 bg-white px-5 py-3 font-bold transition-colors hover:bg-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Continuar no pedido
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-12 cursor-pointer rounded-full bg-primary px-5 py-3 font-bold transition-colors hover:bg-chocolate hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Sair e limpar pedido
          </button>
        </div>
      </section>
    </dialog>
  );
}
