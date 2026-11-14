"use client";

import { useEffect } from "react";

/**
 * One document-level listener feeds the cursor position to whichever `.spotlight` tile is under it
 * (as --sx/--sy), instead of a listener per tile. Mouse and trackpad only.
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const tile = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      tile.style.setProperty("--sx", `${e.clientX - r.left}px`);
      tile.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
