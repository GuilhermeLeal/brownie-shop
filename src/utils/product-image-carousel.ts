export type SwipeDirection = "previous" | "next";

export function getCircularImageIndex(
  currentIndex: number,
  offset: number,
  imageCount: number,
) {
  if (
    !Number.isInteger(currentIndex) ||
    !Number.isInteger(offset) ||
    !Number.isInteger(imageCount) ||
    imageCount < 1
  ) {
    throw new RangeError("Índices do carrossel inválidos.");
  }

  return ((currentIndex + offset) % imageCount + imageCount) % imageCount;
}

export function getSwipeDirection(
  deltaX: number,
  deltaY: number,
  minimumDistance = 48,
): SwipeDirection | null {
  const horizontalDistance = Math.abs(deltaX);
  const verticalDistance = Math.abs(deltaY);

  if (
    horizontalDistance < minimumDistance ||
    horizontalDistance <= verticalDistance * 1.25
  ) {
    return null;
  }

  return deltaX < 0 ? "next" : "previous";
}
