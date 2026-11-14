"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

/** Counts from 0 to `value` the first time it scrolls into view. Renders the final value in HTML. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || value === 0) {
      el.textContent = String(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = Math.round(v).toLocaleString("en");
      },
    });
    return () => controls.stop();
  }, [seen, value]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en")}
    </span>
  );
}
