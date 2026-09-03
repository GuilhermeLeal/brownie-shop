"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";

import {
  getCircularImageIndex,
  getSwipeDirection,
} from "@/utils/product-image-carousel";

type SwipeStart = {
  x: number;
  y: number;
  pointerId: number;
};

type ProductImageCarouselProps = {
  images: readonly string[];
  productName: string;
  className?: string;
};

export function ProductImageCarousel({
  images,
  productName,
  className = "",
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeStartRef = useRef<SwipeStart | null>(null);
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;

  function showImage(offset: number) {
    setCurrentIndex((index) =>
      getCircularImageIndex(index, offset, imageCount),
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (!hasMultipleImages || event.pointerType !== "touch" || !event.isPrimary) {
      return;
    }

    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    const swipeStart = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!swipeStart || swipeStart.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const direction = getSwipeDirection(
      event.clientX - swipeStart.x,
      event.clientY - swipeStart.y,
    );

    if (direction === "next") {
      showImage(1);
    } else if (direction === "previous") {
      showImage(-1);
    }
  }

  function handlePointerCancel() {
    swipeStartRef.current = null;
  }

  if (imageCount === 0) {
    return null;
  }

  return (
    <figure
      className={`relative aspect-[8/5] touch-pan-y overflow-hidden rounded-[1.5rem] bg-white/30 select-none sm:rounded-[2rem] md:aspect-[4/3] ${className}`}
      aria-label={
        hasMultipleImages
          ? `Galeria de imagens de ${productName}`
          : `Imagem de ${productName}`
      }
      aria-roledescription={hasMultipleImages ? "carrossel" : undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {images.map((src, index) => {
        const isCurrent = index === currentIndex;

        return (
          <div
            key={src}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-[opacity,transform] duration-[250ms] ease-out motion-reduce:transform-none motion-reduce:transition-none ${
              isCurrent
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-[1.015] opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={
                hasMultipleImages
                  ? `${productName}, imagem ${index + 1} de ${imageCount}.`
                  : `Foto de ${productName}.`
              }
              fill
              sizes="(min-width: 1200px) 430px, (min-width: 768px) 38vw, 100vw"
              draggable={false}
              className="object-cover"
            />
          </div>
        );
      })}

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={() => showImage(-1)}
            aria-label={`Imagem anterior de ${productName}`}
            className="absolute top-1/2 left-3 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-chocolate/80 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chocolate motion-reduce:transition-none sm:left-4"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => showImage(1)}
            aria-label={`Próxima imagem de ${productName}`}
            className="absolute top-1/2 right-3 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-chocolate/80 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chocolate motion-reduce:transition-none sm:right-4"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div
            className="absolute right-0 bottom-3 left-0 z-10 flex justify-center gap-1 sm:bottom-4"
            aria-label={`Escolher imagem de ${productName}`}
          >
            {images.map((src, index) => {
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ver imagem ${index + 1} de ${productName}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-chocolate"
                >
                  <span
                    className={`block rounded-full shadow-sm ring-1 ring-chocolate/25 transition-[width,height,background-color] duration-200 motion-reduce:transition-none ${
                      isCurrent
                        ? "size-3 bg-primary"
                        : "size-2.5 bg-white/90"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Imagem {currentIndex + 1} de {imageCount} de {productName}
          </p>
        </>
      )}
    </figure>
  );
}
