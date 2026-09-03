"use client";

import { useSyncExternalStore } from "react";

import { SHOP_TIME_ZONE } from "@/constants/order";
import {
  getDateInputValueInTimeZone,
  getMinimumOrderDate,
} from "@/utils/date";

function subscribe() {
  return () => undefined;
}

function getMinimumDateSnapshot() {
  const shopToday = getDateInputValueInTimeZone(SHOP_TIME_ZONE);
  return getMinimumOrderDate(shopToday);
}

export function useMinimumOrderDate() {
  return useSyncExternalStore(subscribe, getMinimumDateSnapshot, () => "");
}
