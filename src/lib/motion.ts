/**
 * Central motion settings. Every animation on the site pulls its timing from here,
 * so the whole feel can be tuned in one place.
 */
import type { Transition, Variants } from "framer-motion";

export const ease = {
  /** Fast start, long soft landing. The house curve. */
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  /** GSAP equivalents. */
  gsapOut: "expo.out",
  gsapInOut: "power3.inOut",
};

export const duration = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.2,
};

export const stagger = {
  chars: 0.028,
  words: 0.06,
  items: 0.08,
};

export const spring = {
  soft: { type: "spring", stiffness: 140, damping: 20, mass: 0.6 } satisfies Transition,
  snappy: { type: "spring", stiffness: 400, damping: 32 } satisfies Transition,
  magnetic: { type: "spring", stiffness: 220, damping: 16, mass: 0.4 } satisfies Transition,
};

/** Viewport options for whileInView reveals. */
export const inView = { once: true, amount: 0.25, margin: "0px 0px -8% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

export const staggerParent = (each = stagger.items, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/** Masked line/word reveal: the child slides up from below its clipping parent. */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: duration.cinematic, ease: ease.out } },
};
