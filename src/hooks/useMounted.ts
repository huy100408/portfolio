"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false during SSR / hydration, true afterwards. For values that depend on the visitor's clock or browser. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
