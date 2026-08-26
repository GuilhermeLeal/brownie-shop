"use client";

import { useSyncExternalStore } from "react";

import { getLocalDateInputValue } from "@/utils/date";

function subscribe() {
  return () => undefined;
}

export function useLocalToday() {
  return useSyncExternalStore(
    subscribe,
    () => getLocalDateInputValue(),
    () => "",
  );
}
