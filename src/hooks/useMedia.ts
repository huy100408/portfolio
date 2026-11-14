"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Returns `fallback` during SSR. */
export function useMedia(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/** True on devices with a precise pointer (mouse / trackpad). */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
export const useReducedMotionPref = () => useMedia("(prefers-reduced-motion: reduce)");
