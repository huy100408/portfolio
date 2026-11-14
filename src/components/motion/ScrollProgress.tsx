"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[linear-gradient(90deg,var(--brand-1),var(--brand-2),var(--brand-3),var(--brand-4))]"
      style={{ scaleX }}
    />
  );
}
