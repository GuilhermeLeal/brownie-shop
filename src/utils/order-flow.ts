type ResetOrderFlowActions = {
  clearCart: () => void;
  resetCheckout: () => void;
  closeCart: () => void;
};

export function resetOrderFlow({
  clearCart,
  resetCheckout,
  closeCart,
}: ResetOrderFlowActions) {
  clearCart();
  resetCheckout();
  closeCart();
}
